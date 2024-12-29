// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "./IYield.sol";

contract Learn {
    IYield public yieldContract;

    struct Course {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 price;
        address teacher;
        uint256 stakedAmount;
        uint256 yieldClaimed;
        bool fundsWithdrawn;
        bool isActive;
    }

    uint256 private nextCourseId;
    mapping(uint256 => Course) private courses;
    mapping(address => uint256[]) private teacherCourses;
    mapping(uint256 => mapping(address => bool)) private enrolledStudents;
    mapping(uint256 => address[]) private courseStudents;
    mapping(uint256 => bool) private activeCourses;

    // Yield tracking
    mapping(address => uint256) private totalStakedAmount;
    mapping(address => uint256) private lastYieldUpdate;

    event CourseCreated(uint256 indexed courseId, string title, address indexed teacher);
    event CourseDeleted(uint256 indexed courseId, address indexed teacher);
    event StudentEnrolled(uint256 indexed courseId, address indexed student);
    event CourseRemoved(uint256 indexed courseId, address indexed student);
    event YieldClaimed(uint256 indexed courseId, address indexed teacher, uint256 amount);
    event StakeWithdrawn(uint256 indexed courseId, address indexed teacher, uint256 amount);
    event FundsTransferred(address indexed to, uint256 amount);

    modifier onlyTeacher(uint256 _courseId) {
        require(courses[_courseId].teacher == msg.sender, "Only the teacher can perform this action");
        _;
    }

    modifier courseExists(uint256 _courseId) {
        require(activeCourses[_courseId], "Course does not exist or was deleted");
        _;
    }

    modifier courseNotEnded(uint256 _courseId) {
        require(block.timestamp < courses[_courseId].endTime, "Course has ended");
        _;
    }

    modifier courseEnded(uint256 _courseId) {
        require(block.timestamp >= courses[_courseId].endTime, "Course has not ended yet");
        _;
    }

    constructor(address _yieldContract) {
        require(_yieldContract != address(0), "Invalid yield contract address");
        yieldContract = IYield(_yieldContract);
    }

    function createCourse(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _price
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_price > 0, "Price must be greater than 0");

        uint256 courseId = nextCourseId++;
        
        courses[courseId] = Course({
            id: courseId,
            title: _title,
            description: _description,
            startTime: _startTime,
            endTime: _endTime,
            price: _price,
            teacher: msg.sender,
            stakedAmount: 0,
            yieldClaimed: 0,
            fundsWithdrawn: false,
            isActive: true
        });

        activeCourses[courseId] = true;
        teacherCourses[msg.sender].push(courseId);
        
        emit CourseCreated(courseId, _title, msg.sender);
    }

    function deleteCourse(uint256 _courseId) 
        external 
        onlyTeacher(_courseId)
        courseExists(_courseId)
    {
        require(courseStudents[_courseId].length == 0, "Cannot delete course with enrolled students");
        
        // Remove from teacher's courses
        uint256[] storage teacherCourseList = teacherCourses[msg.sender];
        for (uint256 i = 0; i < teacherCourseList.length; i++) {
            if (teacherCourseList[i] == _courseId) {
                teacherCourseList[i] = teacherCourseList[teacherCourseList.length - 1];
                teacherCourseList.pop();
                break;
            }
        }

        activeCourses[_courseId] = false;
        courses[_courseId].isActive = false;
        
        emit CourseDeleted(_courseId, msg.sender);
    }

    function buyCourse(uint256 _courseId) 
        external 
        payable 
        courseExists(_courseId)
        courseNotEnded(_courseId)
    {
        Course storage course = courses[_courseId];
        require(!enrolledStudents[_courseId][msg.sender], "Already enrolled");
        require(msg.sender != course.teacher, "Teacher cannot enroll in own course");
        require(msg.value == course.price, "Incorrect payment amount");

        // Update enrollments
        enrolledStudents[_courseId][msg.sender] = true;
        courseStudents[_courseId].push(msg.sender);
        
        // Stake the payment
        yieldContract.stake{value: msg.value}();
        course.stakedAmount += msg.value;
        totalStakedAmount[course.teacher] += msg.value;
        lastYieldUpdate[course.teacher] = block.timestamp;

        emit StudentEnrolled(_courseId, msg.sender);
    }

    function removeCourse(uint256 _courseId)
        external
        courseExists(_courseId)
    {
        require(enrolledStudents[_courseId][msg.sender], "Not enrolled in this course");
        
        // Remove from enrolled students
        enrolledStudents[_courseId][msg.sender] = false;
        
        // Remove from course students array
        address[] storage students = courseStudents[_courseId];
        for (uint256 i = 0; i < students.length; i++) {
            if (students[i] == msg.sender) {
                students[i] = students[students.length - 1];
                students.pop();
                break;
            }
        }
        
        emit CourseRemoved(_courseId, msg.sender);
    }

    function claimCourseYield(uint256 _courseId) 
        external 
        onlyTeacher(_courseId)
        courseExists(_courseId)
        courseEnded(_courseId)
    {
        Course storage course = courses[_courseId];
        require(!course.fundsWithdrawn, "Yield already claimed");
        
        uint256 yieldEarned = yieldContract.calculateYieldTotal(address(this));
        require(yieldEarned > 0, "No yield to claim");

        // Withdraw yield from the contract
        yieldContract.withdrawYield();
        course.yieldClaimed += yieldEarned;
        
        // Transfer yield to teacher
        (bool success, ) = payable(msg.sender).call{value: yieldEarned}("");
        require(success, "Yield transfer failed");

        emit YieldClaimed(_courseId, msg.sender, yieldEarned);
    }

    function withdrawCourseFunds(uint256 _courseId)
        external
        onlyTeacher(_courseId)
        courseExists(_courseId)
        courseEnded(_courseId)
    {
        Course storage course = courses[_courseId];
        require(!course.fundsWithdrawn, "Funds already withdrawn");
        require(course.stakedAmount > 0, "No funds to withdraw");

        uint256 amountToWithdraw = course.stakedAmount;
        course.fundsWithdrawn = true;
        totalStakedAmount[msg.sender] -= amountToWithdraw;

        // Unstake from yield contract
        yieldContract.unstake(amountToWithdraw);
        
        // Transfer funds to teacher
        (bool success, ) = payable(msg.sender).call{value: amountToWithdraw}("");
        require(success, "Fund transfer failed");

        emit StakeWithdrawn(_courseId, msg.sender, amountToWithdraw);
    }

    // View Functions

    function getAllCourses() external view returns (Course[] memory) {
        uint256 activeCount = 0;
        
        // Count active courses
        for (uint256 i = 0; i < nextCourseId; i++) {
            if (activeCourses[i]) {
                activeCount++;
            }
        }
        
        Course[] memory activeCoursesList = new Course[](activeCount);
        uint256 currentIndex = 0;
        
        // Populate active courses
        for (uint256 i = 0; i < nextCourseId; i++) {
            if (activeCourses[i]) {
                activeCoursesList[currentIndex] = courses[i];
                currentIndex++;
            }
        }
        
        return activeCoursesList;
    }

    function getMyCoursesInstructor() external view returns (Course[] memory) {
        uint256[] memory courseIds = teacherCourses[msg.sender];
        uint256 activeCount = 0;
        
        // Count active courses
        for (uint256 i = 0; i < courseIds.length; i++) {
            if (activeCourses[courseIds[i]]) {
                activeCount++;
            }
        }
        
        Course[] memory activeCourses = new Course[](activeCount);
        uint256 currentIndex = 0;
        
        // Populate active courses
        for (uint256 i = 0; i < courseIds.length; i++) {
           
                activeCourses[currentIndex] = courses[courseIds[i]];
                currentIndex++;
            
        }
        
        return activeCourses;
    }

    function getMyCoursesLearner() external view returns (Course[] memory) {
        uint256 enrolledCount = 0;
        
        // Count enrolled courses
        for (uint256 i = 0; i < nextCourseId; i++) {
            if (enrolledStudents[i][msg.sender] && activeCourses[i]) {
                enrolledCount++;
            }
        }
        
        Course[] memory enrolledCourses = new Course[](enrolledCount);
        uint256 currentIndex = 0;
        
        // Populate enrolled courses
        for (uint256 i = 0; i < nextCourseId; i++) {
            if (enrolledStudents[i][msg.sender] && activeCourses[i]) {
                enrolledCourses[currentIndex] = courses[i];
                currentIndex++;
            }
        }
        
        return enrolledCourses;
    }

    function getEnrolledStudents(uint256 _courseId) 
        external 
        view 
        onlyTeacher(_courseId)
        courseExists(_courseId)
        returns (address[] memory) 
    {
        return courseStudents[_courseId];
    }

    function getCourseYieldInfo(uint256 _courseId)
        external
        view
        courseExists(_courseId)
        returns (
            uint256 stakedAmount,
            uint256 yieldClaimed,
            bool fundsWithdrawn
        )
    {
        Course storage course = courses[_courseId];
        return (course.stakedAmount, course.yieldClaimed, course.fundsWithdrawn);
    }

    function calculateYield(address teacher) public view returns (uint256) {
        if (totalStakedAmount[teacher] == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - lastYieldUpdate[teacher];
        // Example yield rate: 0.1% per day
        uint256 yieldRate = 1000; // 0.1% = 1000 / 1000000
        return (totalStakedAmount[teacher] * timeElapsed * yieldRate) / (1000000 * 1 days);
    }

    // Optional: Add a function to handle receiving ETH
    receive() external payable {
        emit FundsTransferred(msg.sender, msg.value);
    }
}