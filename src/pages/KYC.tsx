
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function KYC() {
  const approvedDocuments = [
    "Aadhar Card",
    "PAN Card",
    "Bank Statement"
  ];

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
          <CardTitle>KYC Approved!</CardTitle>
          <CardDescription>your kyc has sucessfully approved now u can take loan</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Approved Documents:</h3>
            <ul className="list-disc list-inside text-left">
              {approvedDocuments.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/apply-loan">Take Loan</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
