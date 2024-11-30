// components/CourseCard.tsx
"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"


interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  onButtonClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description,onButtonClick }) => {
  return (
    <Card className="max-w-sm border shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Learn more about this topic and enhance your skills with our expert-led course.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onButtonClick}>buy</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
