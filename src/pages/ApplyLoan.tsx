import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLoan } from '@/contexts/LoanContext';
import jsPDF from 'jspdf';
import { formatCurrency } from '@/utils/validation';

interface Message {
  text: string | React.ReactNode;
  sender: 'user' | 'bot';
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="Bot" />
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}
      >
        {typeof message.text === 'string' ? <p className="text-sm">{message.text}</p> : message.text}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

const ApplyLoan: React.FC = () => {

  const { user } = useAuth();

  const { addApplication, updateApplication } = useLoan();

  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState('');

  const [conversationStage, setConversationStage] = useState('start');

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);



  const initialLoanDetails = {

    amount: 0,

    tenure: 0,

    purpose: '',

    interestRate: 0,

  };



  const [loanDetails, setLoanDetails] = useState(initialLoanDetails);
  const [finalInterestRate, setFinalInterestRate] = useState(0);
  const [offers, setOffers] = useState<{amount: number, rate: number}[]>([]);

  const calculateInterest = (loanAmount: number, tenure: number) => {
    const baseRate = 8;
    const logAmount = Math.log10(loanAmount);
    let interest = baseRate + (6 - logAmount) * 0.75 - Math.max(0, (logAmount - 6) * 0.5);

    if (tenure > 12) {
      const tenureFactor = (tenure / 12 - 1) * 0.25;
      interest += tenureFactor;
    }

    return Math.min(18, Math.max(6, interest));
  };

  const resetConversation = () => {
    setMessages([]);
    setLoanDetails(initialLoanDetails);
    setFinalInterestRate(0);
    setOffers([]);
    setInput('');
    const newId = addApplication({
      amount: 0,
      tenure: 0,
      purpose: '',
      interestRate: 0,
      status: 'Pending',
      type: 'Personal',
    });
    setCurrentApplicationId(newId);
    addMessage(
      `Hello ${user?.fullName}! Let's start a new loan application. What is your desired loan amount?`,
      'bot'
    );
    setConversationStage('start');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    resetConversation();
  }, [user]);

  useEffect(() => {
    if (conversationStage === 'generate_offers' && loanDetails.tenure > 0) {
      const { amount, tenure } = loanDetails;
      const newOffers = [
        { amount: amount, rate: parseFloat(calculateInterest(amount, tenure).toFixed(2)) },
        { amount: Math.min(10000000, Math.round(amount * 1.1 / 1000) * 1000), rate: parseFloat(calculateInterest(amount * 1.1, tenure).toFixed(2)) },
        { amount: Math.max(50000, Math.round(amount * 0.9 / 1000) * 1000), rate: parseFloat(calculateInterest(amount * 0.9, tenure).toFixed(2)) },
      ];
      setOffers(newOffers);

      addMessage(
          <div>
              <p>Great! Based on your requested amount and tenure, here are a few options for you:</p>
              <p>1. <strong>{formatCurrency(newOffers[0].amount)}</strong> at <strong>{newOffers[0].rate}%</strong> p.a.</p>
              <p>2. <strong>{formatCurrency(newOffers[1].amount)}</strong> at <strong>{newOffers[1].rate}%</strong> p.a.</p>
              <p>3. <strong>{formatCurrency(newOffers[2].amount)}</strong> at <strong>{newOffers[2].rate}%</strong> p.a.</p>
              <p>Please type '1', '2', or '3' to choose an option.</p>
          </div>,
          'bot'
      );
      setConversationStage('handle_amount_offer_choice');
    }
  }, [loanDetails, conversationStage]);

  useEffect(() => {
    if (conversationStage === 'reviewing_details' && loanDetails.purpose) {
      addMessage(
        <div>
            <p>Thank you. Please review your loan details:</p>
            <p><strong>Loan Amount:</strong> {formatCurrency(loanDetails.amount)}</p>
            <p><strong>Tenure:</strong> {loanDetails.tenure} months</p>
            <p><strong>Purpose:</strong> {loanDetails.purpose}</p>
            <p><strong>Interest Rate:</strong> {finalInterestRate}% p.a.</p>
            <p>Is this correct? (yes/no)</p>
        </div>,
        'bot'
      );
      setConversationStage('confirm_details');
    }
  }, [loanDetails, conversationStage]);

  const addMessage = (text: string | React.ReactNode, sender: 'user' | 'bot') => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  useEffect(() => {
    const handleResize = () => {
      if (cardRef.current) {
        cardRef.current.style.height = `${window.innerHeight * 0.7}px`;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    addMessage(input, 'user');
    processUserInput(input);
    setInput('');
  };
  
  const processUserInput = (userInput: string) => {
    setTimeout(() => {
      switch (conversationStage) {
        case 'start':
          const amountMatch = userInput.match(/[\d,]+/);
          const amount = amountMatch ? parseInt(amountMatch[0].replace(/,/g, ''), 10) : NaN;
          if (isNaN(amount) || amount < 50000 || amount > 10000000) {
            addMessage('Please enter a valid loan amount. Our minimum loan amount is 50,000 and the maximum is 1 crore.', 'bot');
          } else {
            setLoanDetails(prev => ({ ...prev, amount }));
            addMessage('Great! Now, what is the desired tenure in months?', 'bot');
            setConversationStage('get_tenure');
          }
          break;

        case 'get_tenure':
          const tenureMatch = userInput.match(/\d+/);
          const tenure = tenureMatch ? parseInt(tenureMatch[0], 10) : NaN;
          if (isNaN(tenure) || tenure <= 0) {
            addMessage('Please enter a valid tenure in months.', 'bot');
          } else {
            setLoanDetails(prev => ({ ...prev, tenure }));
            setConversationStage('generate_offers');
          }
          break;

        case 'handle_amount_offer_choice':
            const choice = parseInt(userInput.trim(), 10);
            if (isNaN(choice) || choice < 1 || choice > offers.length) {
                addMessage("Invalid choice. Please type '1', '2', or '3'.", 'bot');
                return;
            }

            const selectedOffer = offers[choice - 1];
            setLoanDetails(prev => ({ ...prev, amount: selectedOffer.amount }));
            setFinalInterestRate(selectedOffer.rate);

            addMessage(`You've selected a loan of ${formatCurrency(selectedOffer.amount)} at ${selectedOffer.rate}%. Now, what is the purpose of this loan? (e.g., Education, Wedding, Business, Other)`, 'bot');
            setConversationStage('get_purpose');
            break;

        case 'get_purpose':
          setLoanDetails(prev => ({ ...prev, purpose: userInput }));
          setConversationStage('reviewing_details');
          break;
        case 'confirm_details':
            const affirmative = /^(y|yes|ha)/i;
            if (affirmative.test(userInput)) {
                addMessage('Thank you for confirming. Processing your loan application...', 'bot');
                setConversationStage('processing');
                processLoan();
            } else {
                addMessage("Let's start over. What is your desired loan amount?", 'bot');
                resetConversation();
            }
            break;
        default:
          addMessage("Sorry, I didn't understand that. Let's start over. What is your desired loan amount?", 'bot');
          setConversationStage('start');
      }
    }, 1000);
  };



  const processLoan = () => {
    setTimeout(() => {
      if (!currentApplicationId) return;

      const isLoanRealistic = (amount: number, tenure: number): boolean => {
        if (amount <= 0 || tenure <= 0) {
          return false;
        }

        // Rule 1: Reject if amount is too low for a long tenure
        if (amount < 100000 && tenure > 36) { // e.g., < 1 lakh for > 3 years
          return false;
        }

        // Rule 2: Reject if amount is too high for a short tenure
        if (amount > 2500000 && tenure < 12) { // e.g., > 25 lakhs for < 1 year
          return false;
        }
        
        // General ratio check (monthly payment shouldn't be too low or too high)
        const monthlyRepayment = amount / tenure;
        if (monthlyRepayment < 2000 || monthlyRepayment > 500000) {
            return false;
        }

        return true;
      };

      const isApproved = isLoanRealistic(loanDetails.amount, loanDetails.tenure);
      
      const updatedApplication = updateApplication(currentApplicationId, {
        type: 'Personal',
        amount: loanDetails.amount,
        tenure: loanDetails.tenure,
        interestRate: finalInterestRate,
        status: isApproved ? 'Approved' : 'Rejected',
      });

      if (updatedApplication) {
        setCurrentApplicationId(updatedApplication.id);
      }

      if (isApproved) {
        addMessage('Congratulations! Your loan has been approved.', 'bot');
        addMessage(
          <div>
            <p>You can download the loan approval letter below.</p>
            <Button onClick={generatePDF} className="mt-2">
              <Download className="mr-2 h-4 w-4" />
              Download Approval Letter
            </Button>
            <Button onClick={resetConversation} className="mt-2 ml-2">
              Start New Application
            </Button>
          </div>,
          'bot'
        );
        setConversationStage('approved');
      } else {
        addMessage('We regret to inform you that your loan application has been rejected. This could be due to an unusually high or low loan amount requested for the selected tenure, which does not meet our lending criteria.', 'bot');
        addMessage(
            <div>
                <p>Would you like to start a new application?</p>
                <Button onClick={resetConversation} className="mt-2">
                    Start New Application
                </Button>
            </div>,
            'bot'
        );
        setConversationStage('rejected');
      }
    }, 3000);
  };



  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const generateContent = () => {
      // Header
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Loan Genie', pageWidth - 14, 20, { align: 'right' });
      doc.setDrawColor(0);
      doc.line(14, 28, pageWidth - 14, 28);

      // Document Info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Reference No: ${currentApplicationId}`, 14, 40);
      doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 14, 40, { align: 'right' });

      // Address
      doc.text(`To,`, 14, 55);
      doc.setFont('helvetica', 'bold');
      doc.text(user?.fullName || '', 14, 60);
      doc.setFont('helvetica', 'normal');

      // Subject
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Subject: Your Personal Loan Application - Approval', 14, 80);

      // Body
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Dear ${user?.fullName},`, 14, 95);
      const bodyText = `We are delighted to inform you that your personal loan application with Loan Genie has been successfully reviewed and approved. We are committed to helping you achieve your financial goals, and we are excited to be a part of your journey.`;
      const splitBody = doc.splitTextToSize(bodyText, pageWidth - 28);
      doc.text(splitBody, 14, 105);

      // Loan Details Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Approved Loan Details', 14, 130);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Parameter', 14, 140);
      doc.text('Details', 80, 140);
      doc.line(14, 142, pageWidth - 14, 142);

      doc.setFont('helvetica', 'normal');
      const detailsY = 150;
      const details = [
        ['Loan Amount', `${formatCurrency(loanDetails.amount)}`],
        ['Loan Tenure', `${loanDetails.tenure} months`],
        ['Purpose of Loan', loanDetails.purpose],
        ['Interest Rate', `${finalInterestRate}% p.a. (Negotiated)`],
        ['Processing Fee', '1% of loan amount'],
      ];
      details.forEach((detail, index) => {
        const y = detailsY + (index * 8);
        doc.text(detail[0], 14, y);
        doc.text(detail[1], 80, y);
      });
      let finalY = detailsY + (details.length * 8);
      
      const closingText = `The loan amount will be disbursed to your registered bank account within 2-3 working days. If you have any questions or require further assistance, please do not hesitate to contact our customer support at support@loangenie.com.`;
      const splitClosing = doc.splitTextToSize(closingText, pageWidth - 28);
      doc.text(splitClosing, 14, finalY + 10);
      
      doc.text('Sincerely,', 14, finalY + 30);
      doc.text('The Loan Genie Team', 14, finalY + 35);
      
      // Add passport photo and signature
      const passportPhoto = localStorage.getItem('passportPhoto');
      const signature = localStorage.getItem('signature');
      
      if (passportPhoto && signature) {
        finalY += 30;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Documents', 14, finalY);
        doc.line(14, finalY + 2, pageWidth - 14, finalY + 2);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Passport Photo', 14, finalY + 10);
        doc.addImage(passportPhoto, 'JPEG', 14, finalY + 15, 20, 20);
        
        doc.text('Signature', 80, finalY + 10);
        doc.addImage(signature, 'JPEG', 80, finalY + 15, 20, 20);
        finalY += 40;
      }
      
      // Footer
      doc.setDrawColor(0);
      doc.line(14, doc.internal.pageSize.getHeight() - 20, pageWidth - 14, doc.internal.pageSize.getHeight() - 20);
      doc.setFontSize(8);
      doc.text('This is a system-generated document and does not require a signature.', pageWidth / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });

      doc.save('Loan_Approval_Letter.pdf');
    };

    generateContent();
  };



  return (

    <div className="container mx-auto p-4 flex justify-center">

      <Card className="w-full max-w-2xl flex flex-col">

        <CardHeader>

          <CardTitle>Apply for a Loan</CardTitle>

        </CardHeader>

        <CardContent className="flex-grow flex flex-col">

          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>

            {messages.map((msg, index) => (

              <ChatMessage key={index} message={msg} />

            ))}

            <div ref={messagesEndRef} />

          </ScrollArea>

          <div className="p-4 border-t flex items-center gap-2">

            <Input

              value={input}

              onChange={e => setInput(e.target.value)}

              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}

              placeholder="Type your message..."

              className="flex-grow"

              disabled={conversationStage === 'processing' || conversationStage === 'approved' || conversationStage === 'rejected'}

            />

            <Button onClick={handleSendMessage} disabled={conversationStage === 'processing' || conversationStage === 'approved' || conversationStage === 'rejected'}>

              <Send className="h-4 w-4" />

            </Button>

          </div>

        </CardContent>

      </Card>

    </div>

  );

};



export default ApplyLoan;