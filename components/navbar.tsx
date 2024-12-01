import { Button } from "./ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu";
  import { interaction } from "@/interaction";
  
  export const Navbar = () => {
    const {connectWallet} = interaction()
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
              <Button onClick={async () => {
                await connectWallet()
              }}>Connect Wallet</Button>
            </NavigationMenuLink>

        </NavigationMenuItem>
            
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  };
  