import { ethers } from 'ethers';
import { useStore } from '@/zustand';

const instructor_address = "0x36CDD37aEcCFB2849cb7a176e97EA16e883744Ac";
const instructor_abi = [{"type":"function","name":"createCourse","inputs":[{"name":"_title","type":"string","internalType":"string"},{"name":"_description","type":"string","internalType":"string"},{"name":"_startTime","type":"uint256","internalType":"uint256"},{"name":"_endTime","type":"uint256","internalType":"uint256"},{"name":"_price","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"deleteCourse","inputs":[{"name":"_courseId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getMyCourses","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct Instructor.Course[]","components":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"title","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"startTime","type":"uint256","internalType":"uint256"},{"name":"endTime","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"},{"name":"teacher","type":"address","internalType":"address"}]}],"stateMutability":"view"},{"type":"event","name":"CourseCreated","inputs":[{"name":"courseId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"title","type":"string","indexed":false,"internalType":"string"},{"name":"teacher","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"CourseDeleted","inputs":[{"name":"courseId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"teacher","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"StudentEnrolled","inputs":[{"name":"courseId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"student","type":"address","indexed":false,"internalType":"address"}],"anonymous":false}];

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
            
            // Check if createCourse method exists
            if (typeof contract.createCourse === 'function') {
                const response = await contract.createCourse(
                    title, 
                    description, 
                    startTime, 
                    endTime, 
                    price
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
            if (typeof contract.getMyCourses === 'function') {
                const response = await contract.getMyCourses();
                
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
        getMyCoursesInstructor
    };
};