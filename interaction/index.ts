/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ethers } from 'ethers';
import { useStore } from '@/zustand';

const instructor_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const instructor_abi = [{"type":"constructor","inputs":[{"name":"_yieldContract","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"receive","stateMutability":"payable"},{"type":"function","name":"buyCourse","inputs":[{"name":"_courseId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"calculateYield","inputs":[{"name":"teacher","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"claimCourseYield","inputs":[{"name":"_courseId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createCourse","inputs":[{"name":"_title","type":"string","internalType":"string"},{"name":"_description","type":"string","internalType":"string"},{"name":"_startTime","type":"uint256","internalType":"uint256"},{"name":"_endTime","type":"uint256","internalType":"uint256"},{"name":"_price","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"deleteCourse","inputs":[{"name":"_courseId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getAllCourses","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct Learn.Course[]","components":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"title","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"startTime","type":"uint256","internalType":"uint256"},{"name":"endTime","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"},{"name":"teacher","type":"address","internalType":"address"},{"name":"stakedAmount","type":"uint256","internalType":"uint256"},{"name":"yieldClaimed","type":"uint256","internalType":"uint256"},{"name":"fundsWithdrawn","type":"bool","internalType":"bool"},{"name":"isActive","type":"bool","internalType":"bool"}]}],"stateMutability":"view"},{"type":"function","name":"getCourseYieldInfo","inputs":[{"name":"_courseId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"stakedAmount","type":"uint256","internalType":"uint256"},{"name":"yieldClaimed","type":"uint256","internalType":"uint256"},{"name":"fundsWithdrawn","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"getEnrolledStudents","inputs":[{"name":"_courseId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"type":"function","name":"getMyCoursesInstructor","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct Learn.Course[]","components":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"title","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"startTime","type":"uint256","internalType":"uint256"},{"name":"endTime","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"},{"name":"teacher","type":"address","internalType":"address"},{"name":"stakedAmount","type":"uint256","internalType":"uint256"},{"name":"yieldClaimed","type":"uint256","internalType":"uint256"},{"name":"fundsWithdrawn","type":"bool","internalType":"bool"},{"name":"isActive","type":"bool","internalType":"bool"}]}],"stateMutability":"view"},{"type":"function","name":"getMyCoursesLearner","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct Learn.Course[]","components":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"title","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"startTime","type":"uint256","internalType":"uint256"},{"name":"endTime","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"},{"name":"teacher","type":"address","internalType":"address"},{"name":"stakedAmount","type":"uint256","internalType":"uint256"},{"name":"yieldClaimed","type":"uint256","internalType":"uint256"},{"name":"fundsWithdrawn","type":"bool","internalType":"bool"},{"name":"isActive","type":"bool","internalType":"bool"}]}],"stateMutability":"view"},{"type":"function","name":"removeCourse","inputs":[{"name":"_courseId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"withdrawCourseFunds","inputs":[{"name":"_courseId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"yieldContract","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IYield"}],"stateMutability":"view"},{"type":"event","name":"CourseCreated","inputs":[{"name":"courseId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"title","type":"string","indexed":false,"internalType":"string"},{"name":"teacher","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"CourseDeleted","inputs":[{"name":"courseId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"teacher","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"CourseRemoved","inputs":[{"name":"courseId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"student","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"FundsTransferred","inputs":[{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"StakeWithdrawn","inputs":[{"name":"courseId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"teacher","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"StudentEnrolled","inputs":[{"name":"courseId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"student","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"YieldClaimed","inputs":[{"name":"courseId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"teacher","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false}];

export const interaction = () => {
    // Safely get store state
    const getStoreState = () => {
        try {
            return {
                address: useStore.getState().address,
                setAddress: useStore.getState().setAddress,
                provider: useStore.getState().provider,
                setProvider: useStore.getState().setProvider
            };
        } catch (error) {
            console.error("Error accessing store state:", error);
            return {
                address: null,
                setAddress: () => {},
                provider: null,
                setProvider: () => {}
            };
        }
    };

    const initEthereum = async () => {   
        try {
            // Check for Ethereum provider
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            if (window.ethereum) {
                // Create provider using ethers.BrowserProvider
                //@ts-ignore
                const provider = new ethers.BrowserProvider(window.ethereum);
                
                // Request account access
                await provider.send("eth_requestAccounts", []);
                
                // Get signer
                const signer = await provider.getSigner();
                
                // Create contract instance
                const instructorContract = new ethers.Contract(
                    instructor_address, 
                    instructor_abi, 
                    signer
                );
                
                return instructorContract;
            } else {
                console.log("MetaMask is not installed!");
                return null;
            }
        } catch (error) {
            console.error("Error initializing Ethereum:", error);
            return null;
        }
    };

    const connectWallet = async () => {
        try {
            // Check for Ethereum provider
            //@ts-ignore
            if (window.ethereum) {
                // Request account access
                //@ts-ignore
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                // Create new provider
                //@ts-ignore
                const newProvider = new ethers.BrowserProvider(window.ethereum);
                
                // Get store state methods
                const { setProvider, setAddress } = getStoreState();
                
                // Update store state
                setProvider(newProvider);
                setAddress(accounts[0]);
                
                console.log('Wallet connected:', accounts[0]);
                return accounts[0];
            } else {
                alert("Please install MetaMask!");
                return null;
            }
        } catch (error) {
            console.error("Error connecting to MetaMask", error);
            return null;
        }
    };

    const createCourse = async (title: string, description: string, startTime: string, endTime: string, price: string) => {
        try {
            console.log("Creating course");
            
            // Initialize contract
            const contract = await initEthereum();
            
            if (!contract) {
                console.log("MetaMask is not installed!");
                return null;
            }
            
            // Convert price from ETH to Wei
            const priceInWei = ethers.parseEther(price);

            console.log("price in wei ",priceInWei)
            
            // Check if createCourse method exists
            if (typeof contract.createCourse === 'function') {
                const response = await contract.createCourse(
                    title, 
                    description, 
                    startTime, 
                    endTime, 
                    priceInWei  // Use the converted Wei value
                );
                
                console.log('Course Created:', response);
                return response;
            } else {
                console.error('createCourse is not a function on the contract');
                return null;
            }
        } catch (error) {
            console.error("Error creating course:", error);
            return null;
        }
    };

    const deleteCourse = async (courseId: string) => {
        try {
            // Initialize contract
            const contract = await initEthereum();
            
            if (!contract) {
                console.log("MetaMask is not installed!");
                return null;
            }
            
            // Check if deleteCourse method exists
            if (typeof contract.deleteCourse === 'function') {
                const response = await contract.deleteCourse(courseId);
                
                console.log('Course Deleted:', response);
                return response;
            } else {
                console.error('deleteCourse is not a function on the contract');
                return null;
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            return null;
        }
    };

    const getMyCoursesInstructor = async () => {
        try {
            // Initialize contract
            const contract = await initEthereum();

            
            if (!contract) {
                console.log("MetaMask is not installed!");
                return null;
            }
            
            // Check if getMyCourses method exists
            if (typeof contract.getMyCoursesInstructor === 'function') {
                const response = await contract.getMyCoursesInstructor();
                
                console.log('My Courses:', response);
                return response;
            } else {
                console.error('getMyCourses is not a function on the contract');
                return null;
            }
        } catch (error) {
            console.error("Error getting courses:", error);
            return null;
        }
    };

    const buyCourse = async (courseId: string, price : string) => {
        try {
            // Initialize contract
            const contract = await initEthereum();
            
            if (!contract) {
                console.log("MetaMask is not installed!");
                return null;
            }

            console.log("price ",price)
            
            // Check if deleteCourse method exists
            if (typeof contract.buyCourse === 'function') {
                const response = await contract.buyCourse(courseId, {
                    value: ethers.parseEther(price.toString())
                });
                
                console.log('Course Bought:', response);
                return response;
            } else {
                console.error('buyCourse is not a function on the contract');
                return null;
            }
        } catch (error) {
            console.error("Error buying course:", error);
            return null;
        }
    };

    const removeCourse = async (courseId: string) => {
        try {
            // Initialize contract
            const contract = await initEthereum();
            
            if (!contract) {
                console.log("MetaMask is not installed!");
                return null;
            }
            
            // Check if deleteCourse method exists
            if (typeof contract.removeCourse === 'function') {
                const response = await contract.removeCourse(courseId);
                
                console.log('Course Removed:', response);
                return response;
            } else {
                console.error('removeCourse is not a function on the contract');
                return null;
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            return null;
        }
    };

    const getMyCoursesLearner = async () => {
        try {
            // Initialize contract
            const contract = await initEthereum();

            
            if (!contract) {
                console.log("MetaMask is not installed!");
                return null;
            }
            
            // Check if getMyCourses method exists
            if (typeof contract.getMyCoursesLearner === 'function') {
                const response = await contract.getMyCoursesLearner();
                
                console.log('My Courses:', response);
                return response;
            } else {
                console.error('getMyCourses is not a function on the contract');
                return null;
            }
        } catch (error) {
            console.error("Error getting courses:", error);
            return null;
        }
    };

    const getAllCourses = async () => {
        try {
            // Initialize contract
            const contract = await initEthereum();
            console.log(contract)
            
            if (!contract) {
                console.log("MetaMask is not installed!");
                return null;
            }
            console.log("hello")
            // Check if getMyCourses method exists
            if (typeof contract.getAllCourses === 'function') {
                console.log("hello2")
                const response = await contract.getAllCourses();
            console.log("hello3")
                
                console.log('My Courses:', response);
                return response;
            } else {
                console.error('getMyCourses is not a function on the contract');
                return null;
            }

        } catch (error) {
            console.error("Error getting courses:", error);
            return null;
        }
    };


    // Return methods
    return {
        connectWallet,
        createCourse,
        deleteCourse,
        getMyCoursesInstructor,
        buyCourse,
        removeCourse,
        getMyCoursesLearner,
        getAllCourses
    };
};