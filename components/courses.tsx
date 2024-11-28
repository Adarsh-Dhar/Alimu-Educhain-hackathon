// components/CourseCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"


interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  onButtonClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description, image, buttonText, onButtonClick }) => {
  return (
    <Card className="max-w-sm border shadow-md">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-t-md" />
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
        <Button onClick={onButtonClick}>{buttonText}</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
