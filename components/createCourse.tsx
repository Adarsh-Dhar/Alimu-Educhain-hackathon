import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
// import { interaction } from "@/interaction"
import axios from "axios"
// import { useRouter } from "next/router"
import { toast } from "@/components/ui/utils/use-toast"

export function CreateCourse() {
    // const router = useRouter()
    const [title, setTitle] = React.useState<string>("")
    const [description, setDescription] = React.useState<string>("")
    const [startDate, setStartDate] = React.useState<Date>()
    const [endDate, setEndDate] = React.useState<Date>()
    const [price, setPrice] = React.useState<number>(0)
    const [isLoading, setIsLoading] = React.useState(false)
    // const { createCourse } = interaction()

    const convertDateToTimestamp = (dateString: string): number => {
      const timestamp = Date.parse(dateString)
      return Math.floor(timestamp / 1000)
    }

    const handleSubmit = async () => {
      if (!title || !description || !startDate || !endDate || !price) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        })
        return
      }

      try {
        setIsLoading(true)
        const start_date = convertDateToTimestamp(startDate.toString())
        const end_date = convertDateToTimestamp(endDate.toString())
        
        // First create course in smart contract
        // await createCourse(
        //   title, 
        //   description, 
        //   start_date.toString(), 
        //   end_date.toString(), 
        //   price.toString()
        // )

        // Then save to backend
        await axios.post('/api/courses', {
          title,
          description,
          startTime: new Date(start_date * 1000).toISOString(),
          endTime: new Date(end_date * 1000).toISOString(),
          price: price * 1e18, // Convert to wei
          teacher: "", // You might want to get this from your auth context
          stakedAmount: 0,
          yieldClaimed: 0,
          fundsWithdrawn: false,
          isActive: true
        })

        toast({
          title: "Success",
          description: "Course created successfully",
        })
        
        // router.push('/courses') // Redirect to courses page
      } catch (error) {
        console.error("Error creating course:", error)
        toast({
          title: "Error",
          description: "Failed to create course. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create course</CardTitle>
        <CardDescription>Create a new course for your audience</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input 
                id="name" 
                placeholder="Title" 
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Textarea 
                placeholder="Description" 
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input 
                id="price" 
                type="number"
                placeholder="Price" 
                onChange={(e) => setPrice(Number(e.target.value))}
                disabled={isLoading}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </CardFooter>
    </Card>
  )
}