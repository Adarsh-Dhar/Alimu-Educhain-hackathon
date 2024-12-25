// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./InstructorYieldManager.sol";

contract Instructor {
    struct Course {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 price;
        address teacher;
        uint256 stakedAmount;      // Added for yield tracking
        uint256 yieldClaimed;      // Added for yield tracking
        bool fundsWithdrawn; 
    }

    uint256 private nextCourseId;
    mapping(uint256 => Course) private courses;
    mapping(address => uint256[]) private teacherCourses;
    mapping(uint256 => mapping(address => bool)) private enrolledStudents;
    mapping(uint256 => address[]) private courseStudents;
    
    // Yield tracking
    mapping(address => uint256) private totalStakedAmount;
    mapping(address => uint256) private lastYieldUpdate;

    event CourseCreated(uint256 courseId, string title, address teacher);
    event CourseDeleted(uint256 courseId, address teacher);
    event StudentEnrolled(uint256 courseId, address student);
    event CourseRemoved(uint256 courseId, address student);
    event YieldClaimed(uint256 courseId, address teacher, uint256 amount);
    event StakeWithdrawn(uint256 courseId, address teacher, uint256 amount);

    

    // Existing functions remain the same...
    function createCourse(
        string memory _title,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _price
    ) external {
        require(_startTime < _endTime, "Start time must be before end time");
        uint256 courseId = nextCourseId;
        nextCourseId++;
        courses[courseId] = Course({
            id: courseId,
            title: _title,
            description: _description,
            startTime: _startTime,
            endTime: _endTime,
            price: _price,
            teacher: msg.sender
        });
        teacherCourses[msg.sender].push(courseId);
        emit CourseCreated(courseId, _title, msg.sender);
    }

    function deleteCourse(uint256 _courseId) external {
        Course storage course = courses[_courseId];
        require(course.teacher == msg.sender, "Only the teacher can delete this course");
        // Remove the course from teacherCourses
        uint256[] storage teacherCourseList = teacherCourses[msg.sender];
        for (uint256 i = 0; i < teacherCourseList.length; i++) {
            if (teacherCourseList[i] == _courseId) {
                teacherCourseList[i] = teacherCourseList[teacherCourseList.length - 1];
                teacherCourseList.pop();
                break;
            }
        }
        delete courses[_courseId];
        emit CourseDeleted(_courseId, msg.sender);
    }

    function getMyCoursesInstructor() external view returns (Course[] memory) {
        uint256[] memory courseIds = teacherCourses[msg.sender];
        Course[] memory myCourses = new Course[](courseIds.length);
        for (uint256 i = 0; i < courseIds.length; i++) {
            myCourses[i] = courses[courseIds[i]];
        }
        return myCourses;
    }

    // New function to buy a course
   function buyCourse(uint256 _id) external payable {
        Course storage course = courses[_id];
        require(course.teacher != address(0), "Course does not exist");
        require(!enrolledStudents[_id][msg.sender], "Already enrolled");
        require(msg.value == course.price, "Incorrect payment amount");

        // Update staking info
        course.stakedAmount += msg.value;
        totalStakedAmount[course.teacher] += msg.value;
        if(lastYieldUpdate[course.teacher] == 0) {
            lastYieldUpdate[course.teacher] = block.timestamp;
        }

        // Enroll student
        enrolledStudents[_id][msg.sender] = true;
        courseStudents[_id].push(msg.sender);

        emit StudentEnrolled(_id, msg.sender);
    }

    // New function to get courses a student has enrolled in
    function getMyCoursesLearner() external view returns (Course[] memory) {
        // Create a dynamic array to store enrolled courses
        uint256[] memory enrolledCourseIds = new uint256[](nextCourseId);
        uint256 count = 0;
        
        // Find courses the student is enrolled in
        for (uint256 i = 0; i < nextCourseId; i++) {
            if (enrolledStudents[i][msg.sender]) {
                enrolledCourseIds[count] = i;
                count++;
            }
        }
        
        // Create an array of courses with the exact number of enrolled courses
        Course[] memory myCourses = new Course[](count);
        for (uint256 i = 0; i < count; i++) {
            myCourses[i] = courses[enrolledCourseIds[i]];
        }
        
        return myCourses;
    }

    // New function to remove a course from a student's enrollment
    function removeCourse(uint256 _id) external {
        // Ensure the student is enrolled in the course
        require(enrolledStudents[_id][msg.sender], "Not enrolled in this course");
        
        // Mark the student as no longer enrolled
        enrolledStudents[_id][msg.sender] = false;
        
        // Remove student from the course's student list
        address[] storage students = courseStudents[_id];
        for (uint256 i = 0; i < students.length; i++) {
            if (students[i] == msg.sender) {
                students[i] = students[students.length - 1];
                students.pop();
                break;
            }
        }
        
        // Emit event
        emit CourseRemoved(_id, msg.sender);
    }

    // Function to get students enrolled in a specific course (only accessible by the course teacher)
    function getEnrolledStudents(uint256 _courseId) external view returns (address[] memory) {
        // Ensure only the course teacher can view enrolled students
        Course memory course = courses[_courseId];
        require(course.teacher == msg.sender, "Only the course teacher can view enrolled students");
        
        return courseStudents[_courseId];
    }

    function getAllCourses() external view returns (Course[] memory) {
        // Create an array of courses with the total number of courses created
        Course[] memory allCourses = new Course[](nextCourseId);
        
        // Populate the array with all courses
        for (uint256 i = 0; i < nextCourseId; i++) {
            allCourses[i] = courses[i];
        }
        
        return allCourses;
    }

     function calculateYield(address teacher) public view returns (uint256) {
        if(totalStakedAmount[teacher] == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - lastYieldUpdate[teacher];
        // Example yield rate: 0.1% per day
        uint256 yieldRate = 1000; // 0.1% = 1000 / 1000000
        uint256 yield = (totalStakedAmount[teacher] * timeElapsed * yieldRate) / (1000000 * 1 days);
        
        return yield;
    }

    // Claim yield for a specific course
    function claimCourseYield(uint256 _courseId) external {
        Course storage course = courses[_courseId];
        require(course.teacher == msg.sender, "Only teacher can claim yield");
        require(block.timestamp >= course.endTime, "Course not ended");
        require(!course.fundsWithdrawn, "Funds already withdrawn");
        require(course.stakedAmount > 0, "No funds staked");

        uint256 totalYield = calculateYield(msg.sender);
        require(totalYield > 0, "No yield available");

        // Calculate proportional yield for this course
        uint256 courseYield = (totalYield * course.stakedAmount) / totalStakedAmount[msg.sender];
        
        // Update state
        course.yieldClaimed += courseYield;
        lastYieldUpdate[msg.sender] = block.timestamp;

        // Transfer yield
        (bool sent, ) = payable(msg.sender).call{value: courseYield}("");
        require(sent, "Failed to send yield");

        emit YieldClaimed(_courseId, msg.sender, courseYield);
    }

    // Withdraw staked funds after course completion
    function withdrawCourseFunds(uint256 _courseId) external {
        Course storage course = courses[_courseId];
        require(course.teacher == msg.sender, "Only teacher can withdraw");
        require(block.timestamp >= course.endTime, "Course not ended");
        require(!course.fundsWithdrawn, "Funds already withdrawn");
        require(course.stakedAmount > 0, "No funds to withdraw");

        uint256 amountToWithdraw = course.stakedAmount;
        
        // Update state
        course.fundsWithdrawn = true;
        totalStakedAmount[msg.sender] -= course.stakedAmount;

        // Transfer funds
        (bool sent, ) = payable(msg.sender).call{value: amountToWithdraw}("");
        require(sent, "Failed to send funds");

        emit StakeWithdrawn(_courseId, msg.sender, amountToWithdraw);
    }

    // View function to get course yield info
    function getCourseYieldInfo(uint256 _courseId) external view returns (
        uint256 stakedAmount,
        uint256 yieldClaimed,
        bool fundsWithdrawn
    ) {
        Course storage course = courses[_courseId];
        return (course.stakedAmount, course.yieldClaimed, course.fundsWithdrawn);
    }
}