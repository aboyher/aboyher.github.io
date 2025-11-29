import { useState } from 'react';

type Stage = 'intro' | 'choice' | 'results';
type Choice = 'save' | 'payoff' | 'invest' | null;

interface FinancialSituation {
  savings: number;
  monthlyIncome: number;
  loanAmount: number;
  loanRate: number;
  loanYears: number;
  windfall: number;
  investmentReturn: number;
  savingsRate: number;
}

export function WindfallDecision() {
  const [stage, setStage] = useState<Stage>('intro');
  const [choice, setChoice] = useState<Choice>(null);

  const situation: FinancialSituation = {
    savings: 5000,
    monthlyIncome: 1000,
    loanAmount: 10000,
    loanRate: 0.03,
    loanYears: 10,
    windfall: 10000,
    investmentReturn: 0.06,
    savingsRate: 0.005,
  };

  const monthlyRate = situation.loanRate / 12;
  const numPayments = situation.loanYears * 12;
  const monthlyPayment = 
    (situation.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  const calculateOutcomes = () => {
    const years = situation.loanYears;
    const months = years * 12;

    const saveOutcome = (() => {
      const windfallGrowth = situation.windfall * Math.pow(1 + situation.savingsRate, years);
      const savingsGrowth = situation.savings * Math.pow(1 + situation.savingsRate, years);
      const totalLoanPayments = monthlyPayment * months;
      const totalInterestPaid = totalLoanPayments - situation.loanAmount;
      
      return {
        finalSavings: windfallGrowth + savingsGrowth,
        totalInterestPaid,
        netWorth: windfallGrowth + savingsGrowth - totalInterestPaid,
        description: 'You kept the windfall in savings and continued paying the loan',
      };
    })();

    const payoffOutcome = (() => {
      const monthlySavings = monthlyPayment;
      const monthlyRate = situation.savingsRate / 12;
      const savedAmount = monthlySavings * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
      const savingsGrowth = situation.savings * Math.pow(1 + situation.savingsRate, years);
      
      return {
        finalSavings: savedAmount + savingsGrowth,
        totalInterestPaid: 0,
        netWorth: savedAmount + savingsGrowth,
        description: 'You paid off the loan immediately and saved the monthly payments',
      };
    })();

    const investOutcome = (() => {
      const investmentGrowth = situation.windfall * Math.pow(1 + situation.investmentReturn, years);
      const savingsGrowth = situation.savings * Math.pow(1 + situation.savingsRate, years);
      const totalLoanPayments = monthlyPayment * months;
      const totalInterestPaid = totalLoanPayments - situation.loanAmount;
      
      return {
        finalSavings: savingsGrowth,
        investmentValue: investmentGrowth,
        totalInterestPaid,
        netWorth: investmentGrowth + savingsGrowth - totalInterestPaid,
        description: 'You invested the windfall and continued paying the loan',
      };
    })();

    return { saveOutcome, payoffOutcome, investOutcome };
  };

  const outcomes = calculateOutcomes();

  const renderIntro = () => (
    <div>
      <div style={{ border: '2px solid black', padding: '20px', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>$10,000 windfall</h1>
        <p style={{ margin: 0 }}>You just got $10,000 unexpectedly</p>
      </div>

      <div style={{ border: '2px solid black', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 15px 0' }}>Current situation</h2>
        <div style={{ fontFamily: 'monospace' }}>
          <p>Savings: ${situation.savings.toLocaleString()}</p>
          <p>Monthly Income: ${situation.monthlyIncome.toLocaleString()}</p>
          <p>Loan Balance: ${situation.loanAmount.toLocaleString()}</p>
          <p>Interest Rate: {(situation.loanRate * 100).toFixed(1)}%</p>
          <p>Monthly Payment: ${monthlyPayment.toFixed(2)}</p>
          <p>Term: {situation.loanYears} years</p>
        </div>
      </div>

      <button 
        onClick={() => setStage('choice')} 
        style={{ 
          border: '2px solid black', 
          padding: '10px 20px',
          background: 'white',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Continue
      </button>
    </div>
  );

  const renderChoice = () => (
    <div>
      <div style={{ border: '2px solid black', padding: '20px', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>What will you do?</h1>
        <p style={{ margin: 0 }}>Choose how to use ${situation.windfall.toLocaleString()}</p>
      </div>

      <button
        onClick={() => {
          setChoice('save');
          setStage('results');
        }}
        style={{ 
          border: '2px solid black', 
          padding: '20px',
          background: 'white',
          width: '100%',
          textAlign: 'left',
          marginBottom: '15px',
          cursor: 'pointer'
        }}
      >
        <h3 style={{ margin: '0 0 10px 0' }}>[1] Keep in savings</h3>
        <p style={{ margin: '5px 0' }}>Add to emergency fund, keep paying loan</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>- Low risk</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>- Earns {(situation.savingsRate * 100).toFixed(1)}% interest</p>
      </button>

      <button
        onClick={() => {
          setChoice('payoff');
          setStage('results');
        }}
        style={{ 
          border: '2px solid black', 
          padding: '20px',
          background: 'white',
          width: '100%',
          textAlign: 'left',
          marginBottom: '15px',
          cursor: 'pointer'
        }}
      >
        <h3 style={{ margin: '0 0 10px 0' }}>[2] Pay off the loan</h3>
        <p style={{ margin: '5px 0' }}>Eliminate debt, save monthly payment</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>- Guaranteed {(situation.loanRate * 100).toFixed(1)}% return</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>- Free up ${monthlyPayment.toFixed(2)}/month</p>
      </button>

      <button
        onClick={() => {
          setChoice('invest');
          setStage('results');
        }}
        style={{ 
          border: '2px solid black', 
          padding: '20px',
          background: 'white',
          width: '100%',
          textAlign: 'left',
          marginBottom: '15px',
          cursor: 'pointer'
        }}
      >
        <h3 style={{ margin: '0 0 10px 0' }}>[3] Invest it</h3>
        <p style={{ margin: '5px 0' }}>Put in stock market, keep paying loan</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>- Higher returns (~{(situation.investmentReturn * 100).toFixed(0)}% avg)</p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>- Market risk</p>
      </button>
    </div>
  );

  const renderResults = () => {
    const allChoices = [
      { key: 'save', label: 'Save', outcome: outcomes.saveOutcome },
      { key: 'payoff', label: 'Pay Off', outcome: outcomes.payoffOutcome },
      { key: 'invest', label: 'Invest', outcome: outcomes.investOutcome },
    ];

    const sortedByNetWorth = [...allChoices].sort((a, b) => b.outcome.netWorth - a.outcome.netWorth);
    const yourChoice = allChoices.find(c => c.key === choice);

    return (
      <div>
        <div style={{ border: '2px solid black', padding: '20px', marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>10 year comparison</h1>
          {yourChoice && (
            <p style={{ margin: 0 }}>You chose: {yourChoice.label}</p>
          )}
        </div>

        {sortedByNetWorth.map((option, index) => {
          const isYourChoice = option.key === choice;
          const isBest = index === 0;

          return (
            <div 
              key={option.key} 
              style={{ 
                border: isBest ? '3px solid black' : '2px solid black', 
                padding: '20px',
                marginBottom: '15px'
              }}
            >
              <h2 style={{ margin: '0 0 15px 0' }}>
                {option.label}
                {isYourChoice && ' (YOU)'}
                {isBest && ' ← BEST'}
              </h2>
              <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                <p>Net Worth: ${option.outcome.netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                {option.key === 'invest' && (
                  <p>Investment: ${option.outcome.investmentValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                )}
                <p>Savings: ${option.outcome.finalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p>Interest Paid: ${option.outcome.totalInterestPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <p>Gain: +${(option.outcome.netWorth - situation.savings).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
          );
        })}

        <div style={{ border: '2px solid black', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 15px 0' }}>Notes</h2>
          <p style={{ fontSize: '14px' }}>Investing usually wins but has risk</p>
          <p style={{ fontSize: '14px' }}>Paying off debt is guaranteed and gives peace of mind</p>
          <p style={{ fontSize: '14px' }}>Saving is safe but low return</p>
        </div>

        <button
          onClick={() => {
            setStage('intro');
            setChoice(null);
          }}
          style={{ 
            border: '2px solid black', 
            padding: '10px 20px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Start over
        </button>
      </div>
    );
  };

  return (
    <div>
      {stage === 'intro' && renderIntro()}
      {stage === 'choice' && renderChoice()}
      {stage === 'results' && renderResults()}
    </div>
  );
}
