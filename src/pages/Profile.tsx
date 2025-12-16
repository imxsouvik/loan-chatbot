import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const steps = [
  { id: '01', name: 'Personal Information', fields: ['fullName', 'dob', 'address'] },
  { id: '02', name: 'Document Upload', fields: ['documentType', 'documentFile', 'passportPhoto', 'signature'] },
  { id: '03', name: 'Review and Submit' },
];

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    dob: user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
    address: '',
    aadhaarNumber: '',
    documentType: '',
    documentFile: null as File | null,
    passportPhoto: null as File | null,
    signature: null as File | null,
  });
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        dob: user.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
      }));
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dob: date }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, documentType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    const ekycDetails = {
      documentType: formData.documentType,
      documentFileName: formData.documentFile?.name,
      passportPhotoName: formData.passportPhoto?.name,
      signatureName: formData.signature?.name,
      fullName: formData.fullName,
      dob: formData.dob.toISOString(),
      address: formData.address,
      aadhaarNumber: formData.aadhaarNumber,
    };
    localStorage.setItem('eKYC_details', JSON.stringify(ekycDetails));

    if (formData.passportPhoto) {
      const passportPhotoBase64 = await toBase64(formData.passportPhoto);
      localStorage.setItem('passportPhoto', passportPhotoBase64);
    }
    if (formData.signature) {
      const signatureBase64 = await toBase64(formData.signature);
      localStorage.setItem('signature', signatureBase64);
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateUser({ kycCompleted: true });
    setIsVerifying(false);
  };


  if (user?.kycCompleted) {
    const details = localStorage.getItem('eKYC_details');
    const kycDetails = details ? JSON.parse(details) : null;

    return (
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>eKYC Verified</CardTitle>
          </CardHeader>
          <CardContent>
            {kycDetails ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium">Personal Information</h4>
                  <div className="space-y-2 mt-2 pl-4">
                    <p><strong>Full Name:</strong> {kycDetails.fullName} <CheckCircle2 className="w-5 h-5 text-green-500 inline-block ml-2" /></p>
                    <p><strong>Date of Birth:</strong> {format(new Date(kycDetails.dob), "PPP")} <CheckCircle2 className="w-5 h-5 text-green-500 inline-block ml-2" /></p>
                    <p><strong>Address:</strong> {kycDetails.address} <CheckCircle2 className="w-5 h-5 text-green-500 inline-block ml-2" /></p>
                    <p><strong>Aadhaar Number:</strong> {kycDetails.aadhaarNumber} <CheckCircle2 className="w-5 h-5 text-green-500 inline-block ml-2" /></p>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium">Documents</h4>
                  <div className="space-y-2 mt-2 pl-4">
                    <p><strong>Document ({kycDetails.documentType}):</strong> {kycDetails.documentFileName} <CheckCircle2 className="w-5 h-5 text-green-500 inline-block ml-2" /></p>
                    <p><strong>Passport Photo:</strong> {kycDetails.passportPhotoName} <CheckCircle2 className="w-5 h-5 text-green-500 inline-block ml-2" /></p>
                    <p><strong>Signature:</strong> {kycDetails.signatureName} <CheckCircle2 className="w-5 h-5 text-green-500 inline-block ml-2" /></p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-green-600">Your eKYC has been successfully verified. You can now apply for a loan.</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>eKYC Verification</CardTitle>
          <Progress value={(currentStep + 1) / steps.length * 100} className="mt-2" />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {currentStep === 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">{steps[0].name}</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.dob && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dob ? format(formData.dob, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dob}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                    <Input id="aadhaarNumber" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required minLength={12} maxLength={12} pattern="\d{12}" title="Aadhaar number must be 12 digits." />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-medium mb-4">{steps[1].name}</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select onValueChange={handleSelectChange} defaultValue={formData.documentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                        <SelectItem value="pan">PAN Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="documentFile">Upload Document</Label>
                    <Input id="documentFile" name="documentFile" type="file" onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="passportPhoto">Passport Size Photo</Label>
                    <Input id="passportPhoto" name="passportPhoto" type="file" onChange={handleChange} required />
                  </div>
                  <div>
                    <Label htmlFor="signature">Signature</Label>
                    <Input id="signature" name="signature" type="file" onChange={handleChange} required />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-medium mb-4">{steps[2].name}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium">Personal Information</h4>
                    <div className="space-y-2 mt-2 pl-4">
                      <p><strong>Full Name:</strong> {formData.fullName}</p>
                      <p><strong>Date of Birth:</strong> {format(formData.dob, "PPP")}</p>
                      <p><strong>Address:</strong> {formData.address}</p>
                      <p><strong>Aadhaar Number:</strong> {formData.aadhaarNumber}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium">Documents</h4>
                    <div className="space-y-2 mt-2 pl-4">
                        <div className="flex items-center">
                            <p><strong>Document ({formData.documentType}):</strong> {formData.documentFile?.name}</p>
                            {formData.documentFile ? <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" /> : <XCircle className="w-5 h-5 text-red-500 ml-2" />}
                        </div>
                        <div className="flex items-center">
                            <p><strong>Passport Photo:</strong> {formData.passportPhoto?.name}</p>
                            {formData.passportPhoto ? <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" /> : <XCircle className="w-5 h-5 text-red-500 ml-2" />}
                        </div>
                        <div className="flex items-center">
                            <p><strong>Signature:</strong> {formData.signature?.name}</p>
                            {formData.signature ? <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" /> : <XCircle className="w-5 h-5 text-red-500 ml-2" />}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {currentStep > 0 && !user?.kycCompleted &&(
                <Button type="button" onClick={handlePrev} variant="outline">Previous</Button>
              )}
              {currentStep < steps.length - 1 && !user?.kycCompleted && ( 
                <Button type="button" onClick={handleNext}>Next</Button>
              )}
              {currentStep === steps.length - 1 && !user?.kycCompleted && (
                <Button type="submit" disabled={isVerifying}>
                  {isVerifying ? 'Verifying...' : 'Submit for Verification'}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
