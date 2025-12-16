export interface ConversationResponse {
  text: string;
  options?: string[];
}

export const getBotResponse = (message: string): ConversationResponse => {
  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('good morning')) {
    return {
      text: "Hello, welcome to our bank. How can I help you today?",
      options: ['Tell me about your bank', 'What services do you provide?', 'What are your interest rates?'],
    };
  }

  if (lowerCaseMessage.includes('about yourself') || lowerCaseMessage.includes('about your bank')) {
    return {
      text: "I am your AI bank assistant of LoanPro. It is a trusted bank offering loans, credit score check, and 24/7 application for taking loans. We focus on your convenience and fast services.",
      options: ['What services do you provide?', 'What are the requirements for a loan?'],
    };
  }

  if (lowerCaseMessage.includes('service') || lowerCaseMessage.includes('provide')) {
    return {
      text: 'We provide a range of services including personal loans, home loans, and vehicle loans. We also offer KYC verification and credit score checks to help you manage your finances.',
      options: ['What types of loans are available?', 'What are the requirements for a loan?'],
    };
  }

  if (lowerCaseMessage.includes('why should i take a loan')) {
    return {
      text: 'Our bank offers flexible interest rates and low-interest options, quick approval, and transparent processes with no hidden charges. We prioritize your convenience and aim to provide a hassle-free experience.',
      options: ['What are your interest rates?', 'What are the requirements for a loan?'],
    };
  }
  
  if (lowerCaseMessage.includes('loan type') || lowerCaseMessage.includes('loans are available')) {
    return {
      text: 'We offer a variety of loans to suit your needs, including Personal Loans, Home Loans, and Vehicle Loans. Which one are you interested in?',
      options: ['Personal Loan', 'Home Loan', 'Vehicle Loan'],
    };
  }

  if (lowerCaseMessage.includes('personal loan')) {
    return {
      text: 'A personal loan is a great option for various needs like weddings, vacations, or medical emergencies. Our personal loans have competitive interest rates and flexible repayment options. Would you like to know more?',
      options: ['What are the interest rates?', 'How do I apply?'],
    };
  }

  if (lowerCaseMessage.includes('home loan')) {
    return {
      text: 'Our home loans can help you buy your dream house. We offer attractive interest rates and long tenure options. Would you like to check your eligibility?',
      options: ['Check my eligibility', 'What are the interest rates?'],
    };
  }

  if (lowerCaseMessage.includes('vehicle loan')) {
    return {
      text: 'With our vehicle loans, you can buy your new car or two-wheeler with ease. We offer quick processing and up to 100% financing on select vehicles. Would you like to apply?',
      options: ['Apply for a vehicle loan', 'What are the interest rates?'],
    };
  }
  
  if (lowerCaseMessage.includes('rate') || lowerCaseMessage.includes('interest')) {
    return {
        text: 'We are very flexible with interest rates. You decide, and we will give you our best options.',
        options: ['Apply for a loan'],
    };
  }

  if (lowerCaseMessage.includes('requirement')) {
    return {
        text: 'To apply for a loan, you need to be a resident of the country, have a steady source of income, and a good credit score. You will also need to complete your KYC verification on our platform.',
        options: ['How to complete KYC?', 'Apply for a loan'],
    };
  }
  
  if (lowerCaseMessage.includes('apply')) {
    return {
      text: "You can apply for a loan directly from your dashboard. Just click on the 'Apply for Loan' button. You need to have your KYC completed before applying.",
      options: ['How to complete KYC?', 'Go to Dashboard'],
    };
  }
  
  if (lowerCaseMessage.includes('kyc')) {
      return {
          text: 'You can complete your KYC from your profile page. You will need to provide your PAN and Aadhaar details.',
          options: ['Go to Profile', 'What is KYC?'],
      };
  }

  if (lowerCaseMessage.includes('bye') || lowerCaseMessage.includes('thank you')) {
    return {
      text: 'You are welcome! Feel free to ask if you have any more questions. Goodbye!',
    };
  }

  return {
    text: "I'm sorry, I didn't quite understand that. Could you please rephrase? You can ask me about our services, loan types, or interest rates.",
    options: ['Tell me about your bank', 'What services do you provide?', 'Why should I take a loan from you?'],
  };
};