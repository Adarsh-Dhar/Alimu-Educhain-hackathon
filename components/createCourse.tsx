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
import { interaction } from "@/interaction"



export function CreateCourse() {
    const [title,setTitle] = React.useState<string>("")
    const [description,setDescription] = React.useState<string>("")
    const [startDate, setStartDate] = React.useState<Date>()
    const [endDate, setEndDate] = React.useState<Date>()
    const [price,setPrice] = React.useState<Number>(0)
    const {createCourse} = interaction()

    const convertDateToTimestamp = (dateString: string): number => {
      // Parse the date string to a timestamp in milliseconds
      const timestamp = Date.parse(dateString);
      
      // Convert milliseconds to seconds (Unix timestamp)
      return Math.floor(timestamp / 1000);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create course</CardTitle>
        <CardDescription>Create a new course for your audience</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input id="name"  placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Textarea  placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
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
              <Input id="price" placeholder="Price" onChange={(e) => setPrice(Number(e.target.value))} />
            </div>
            
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={async () => {
          console.log("hi hi")

            if (startDate && endDate) {
          console.log("hi")
              const start_date = convertDateToTimestamp(startDate.toString())
              const end_date = convertDateToTimestamp(endDate.toString())
              console.log("price",price)
                await createCourse(title, description, start_date.toString(), end_date.toString(), price.toString())
                
            }else {
              console.log("errror in creating course")
            }
            console.log("yo")
        }}>Create</Button>
      </CardFooter>
    </Card>
  )
}
