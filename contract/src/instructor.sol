// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Instructor {
    struct Course {
        uint256 id;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 price;
        address teacher;
    }

    uint256 private nextCourseId;
    mapping(uint256 => Course) private courses;
    mapping(address => uint256[]) private teacherCourses;
    mapping(uint256 => mapping(address => bool)) private enrolledStudents;
    mapping(uint256 => address[]) private courseStudents;

    event CourseCreated(uint256 courseId, string title, address teacher);
    event CourseDeleted(uint256 courseId, address teacher);
    event StudentEnrolled(uint256 courseId, address student);
    event CourseRemoved(uint256 courseId, address student);

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
        // Retrieve the course
        // Course storage course = courses[_id];
                
        // Ensure the student hasn't already enrolled
        require(!enrolledStudents[_id][msg.sender], "Already enrolled in this course");
        
        // Check if the correct amount is paid
        // require(msg.value == course.price, "Insufficient payment");
        
        // Mark the student as enrolled
        enrolledStudents[_id][msg.sender] = true;
        
        // Add student to the course's student list
        courseStudents[_id].push(msg.sender);
        
        // Emit event
        emit StudentEnrolled(_id, msg.sender);
        
        // // Refund excess payment
        // if (msg.value > course.price) {
        //     payable(msg.sender).transfer(msg.value - course.price);
        // }
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
}