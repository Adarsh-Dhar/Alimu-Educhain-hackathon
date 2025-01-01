import { Button } from "./ui/button";
import {
    NavigationMenu,
    // NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    // NavigationMenuTrigger,
    navigationMenuTriggerStyle
  } from "@/components/ui/navigation-menu";
  import { interaction } from "@/interaction";
  import Link from "next/link"
  
  export const Navbar = () => {
    const {connectWallet} = interaction()
    return (
      <div className="flex items-center justify-end space-x-6 p-4">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
            <Link href="/learner" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Learner
            </NavigationMenuLink>
          </Link>
              {/* <NavigationMenuTrigger>Learner</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>My Courses</NavigationMenuLink>
                <NavigationMenuLink>Buy Courses</NavigationMenuLink>
                <NavigationMenuLink>Delete Courses</NavigationMenuLink>
              </NavigationMenuContent> */}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
  
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
            <Link href="/instructor" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Instructor
            </NavigationMenuLink>
          </Link>
              {/* <NavigationMenuTrigger>Instructor</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>My Courses</NavigationMenuLink>
                <NavigationMenuLink>Add Courses</NavigationMenuLink>
                <NavigationMenuLink>DeleteCourses</NavigationMenuLink>

              </NavigationMenuContent> */}
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
  