//instructor contract 0x36CDD37aEcCFB2849cb7a176e97EA16e883744Ac

import { ethers } from 'ethers';
const instructor_address = "0x36CDD37aEcCFB2849cb7a176e97EA16e883744Ac";
const instructor_abi = [{"type":"function","name":"createCourse","inputs":[{"name":"_title","type":"string","internalType":"string"},{"name":"_description","type":"string","internalType":"string"},{"name":"_startTime","type":"uint256","internalType":"uint256"},{"name":"_endTime","type":"uint256","internalType":"uint256"},{"name":"_price","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"deleteCourse","inputs":[{"name":"_courseId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getMyCourses","inputs":[],"outputs":[{"name":"","type":"tuple[]","internalType":"struct Instructor.Course[]","components":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"title","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"startTime","type":"uint256","internalType":"uint256"},{"name":"endTime","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"},{"name":"teacher","type":"address","internalType":"address"}]}],"stateMutability":"view"},{"type":"event","name":"CourseCreated","inputs":[{"name":"courseId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"title","type":"string","indexed":false,"internalType":"string"},{"name":"teacher","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"CourseDeleted","inputs":[{"name":"courseId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"teacher","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"StudentEnrolled","inputs":[{"name":"courseId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"student","type":"address","indexed":false,"internalType":"address"}],"anonymous":false}]
import { useStore } from '@/zustand';




export const interaction = () => {
    let signer : any;
const address = useStore.getState().address;
    const setAddress = useStore((state : any) => state.setAddress);
    const provider = useStore.getState().provider;
    const setProvider = useStore((state : any) => state.setProvider)

 const initEthereum = async () => {   
    //@ts-ignore
    if (window.ethereum) {
        //@ts-ignore
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();
        console.log(`signer : ${signer}`)
        console.log(`provider : ${provider}`)
        const instructorContract = new ethers.Contract(instructor_address, instructor_abi, signer);
        return instructorContract

    } else {
        console.log("MetaMask is not installed!");
        return null;
    }
}

const connectWallet = async () => {
      //@ts-ignore
    if (window.ethereum) {
        try {
            //@ts-ignore
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          //@ts-ignore
          setProvider(await new ethers.BrowserProvider(window.ethereum));

          setAddress(accounts[0]);
          console.log(provider)
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
};


const createCourse = async (title : string, description:string, startTime : string, endTime : string, price : string) => {
    try{
        const contract = await initEthereum();
    if (!contract) {
        console.log("MetaMask is not installed!");
        return null; // Ensure function returns null if MetaMask is not installed
    }
    else{
        //@ts-ignore
        if(typeof contract.createCourse === 'function'){
          const response = await contract.createCourse(title, description, startTime,endTime,price);
        
          console.log('Create Courses:', response);
        }else{
          console.error('createCourse is not a function on the contract');
        }
       
     }
    }catch{

    }
 
}

 const deleteCourse = async (courseId : string) => {
    try{
        const contract = await initEthereum();
    if (!contract) {
        console.log("MetaMask is not installed!");
        return null; // Ensure function returns null if MetaMask is not installed
    }
    else{
        //@ts-ignore
        if(typeof contract.deleteCourse === 'function'){
          const response = await contract.deleteCourse(courseId);
        
          console.log('Delete Courses:', response);
        }else{
          console.error('deleteCourse is not a function on the contract');
        }
       
     }
    }catch{

    }
 
}

const getMyCoursesInstructor = async () => {
    try{
        const contract = await initEthereum();
    if (!contract) {
        console.log("MetaMask is not installed!");
        return null; // Ensure function returns null if MetaMask is not installed
    }
    else{
        //@ts-ignore
        if(typeof contract.getMyCourses === 'function'){
          const response = await contract.getMyCourses();
        
          console.log('get courses', response);
        }else{
          console.error('getMyCourses is not a function on the contract');
        }
       
     }
    }catch{

    }
 
}

return {connectWallet,createCourse,deleteCourse,getMyCoursesInstructor}

}
