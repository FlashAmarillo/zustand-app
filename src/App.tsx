import './App.css';
import { Container, Stack, Typography } from '@mui/material';
import { JavascriptLogo } from './components/JavaScriptLogo';
import Start from './components/Start';
import { useQuestionsStore } from './store/questions';
import Game from './components/Game';

function App() {

  // definimos las questions leyendo desde el estado global de la siguiente forma:
  const questions = useQuestionsStore( state => state.questions);

  console.log(questions);

  return (
    <main>
      <Container maxWidth='sm'>

        <Stack direction='row' gap={2} alignItems='center' justifyContent='center' >
          <JavascriptLogo />
          <Typography component='h1' variant='h2'>
            JavaScript Quizz
          </Typography>
        </Stack>

        {questions.length === 0 && <Start />}
        {questions.length > 0 && <Game /> }

      </Container>
    </main>
  )
}

export default App
