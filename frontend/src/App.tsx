import React, { useState } from 'react';
import { Container, Paper, Grid, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { backend } from 'declarations/backend';

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '1.5rem',
  padding: theme.spacing(2),
  margin: theme.spacing(0.5),
}));

const Display = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: 'right',
  fontSize: '2rem',
  minHeight: '60px',
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    backend.clear();
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      performCalculation(operator, inputValue);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = async (op: string, secondOperand: number) => {
    if (firstOperand === null) return;

    setLoading(true);
    try {
      const result = await backend.calculate(firstOperand, secondOperand, op);
      switch (result.tag) {
        case 'ok':
          setDisplay(result.value.toString());
          setFirstOperand(result.value);
          break;
        case 'err':
          setDisplay('Error');
          break;
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setDisplay('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleEquals = () => {
    if (operator && firstOperand !== null) {
      performCalculation(operator, parseFloat(display));
      setOperator(null);
      setWaitingForSecondOperand(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Display>
          {loading ? <CircularProgress size={24} /> : null}
          <Typography variant="h4" component="div">
            {display}
          </Typography>
        </Display>
        <Grid container spacing={1}>
          <Grid item xs={9}>
            <Grid container>
              {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((btn) => (
                <Grid item xs={4} key={btn}>
                  <CalculatorButton
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => (btn === '.' ? inputDecimal() : inputDigit(btn))}
                  >
                    {btn}
                  </CalculatorButton>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container direction="column">
              {['/', '*', '-', '+'].map((op) => (
                <Grid item key={op}>
                  <CalculatorButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleOperator(op)}
                  >
                    {op}
                  </CalculatorButton>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={1} mt={1}>
          <Grid item xs={6}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="error"
              onClick={clear}
              startIcon={<BackspaceIcon />}
            >
              Clear
            </CalculatorButton>
          </Grid>
          <Grid item xs={6}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="success"
              onClick={handleEquals}
            >
              =
            </CalculatorButton>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default App;
