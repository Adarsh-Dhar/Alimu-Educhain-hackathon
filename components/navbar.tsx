import Link from "next/link";
import { Button } from "./ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu";
  
  export const Navbar = () => {
    return (
      <div className="flex items-center space-x-6 bg-gray-100 p-4">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Learner</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>My Courses</NavigationMenuLink>
                <NavigationMenuLink>Buy Courses</NavigationMenuLink>
                <NavigationMenuLink>Delete Courses</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
  
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Instructor</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>My Courses</NavigationMenuLink>
                <NavigationMenuLink>Add Courses</NavigationMenuLink>
                <NavigationMenuLink>DeleteCourses</NavigationMenuLink>

              </NavigationMenuContent>
            </NavigationMenuItem>
            
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
          <NavigationMenuItem>

            <NavigationMenuLink>
              <Button>Connect Wallet</Button>
            </NavigationMenuLink>

        </NavigationMenuItem>
            
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  };
  