import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Hourglass } from "lucide-react";

const PsychologistProfileSubmitted = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center bg-background my-8">
      <Card className="w-full max-w-md shadow-lg border rounded-2xl">
        <CardHeader className="text-center">
          <Hourglass className="w-16 h-16 text-primary mx-auto" />
          <CardTitle className="text-xl font-semibold mt-4">Profile Under Review</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
          <p>Your psychologist profile has been submitted successfully and is under verification.</p>
          <p className="mt-2">Once approved by the admin, you will be listed and can start receiving clients.</p>
          {/* <Button className="mt-6 w-full" onClick={() => navigate("/psychologist/dashboard")}>Go to Dashboard</Button> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychologistProfileSubmitted;
