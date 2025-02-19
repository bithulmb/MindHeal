import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";

const PsychologistProfileRejected = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center bg-background min-h-screen">
      <Card className="w-full max-w-md shadow-lg border rounded-2xl">
        <CardHeader className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <CardTitle className="text-xl font-semibold mt-4 text-red-600">
            Profile Rejected
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
          <p>Your psychologist profile has been rejected.</p>
          <p className="mt-2">Please contact the admin for further assistance.</p>
          {/* <Button className="mt-6 w-full" onClick={() => navigate("/psychologist/support")}>Contact Admin</Button> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychologistProfileRejected;
