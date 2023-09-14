import { IconButton, Stack, Card, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useQuestionsStore } from "../store/questions";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { type Question as QuestionType } from "../types";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Footer from "./Footer";

const getBackgroundColor = ( info: QuestionType, index: number) => {
  const { userSelectedAnswer, correctAnswer} = info

  // usuario no ha seleccionado nada todavia
  if(userSelectedAnswer == null) return 'transparent'

  // si ya selecciono pero la solucion es incorrecta
  if( index !== correctAnswer && index !== userSelectedAnswer) return 'transparent'

  // si selecciona la solucion correcta
  if( index === correctAnswer ) return 'green'

  // si selecciona una opcion incorrecta
  if( index === userSelectedAnswer) return 'red'

  // si no es ninguna de las anteriores
  return 'transparent'

}

const Question = ({ info } : { info: QuestionType }) => {

    const selectAnswer = useQuestionsStore( state => state.selectAnswer);

    const createHandleClick = (answerIndex: number ) => () => {
        selectAnswer(info.id, answerIndex)
    }


    return (
        <Card variant='outlined' sx={{ bgcolor: '#222', p: 2 ,textAlign: 'left', marginTop: 4}} >
            <Typography variant="h5">
                {info.question}
            </Typography>
            
            <SyntaxHighlighter language="javascript" style={nightOwl}>
                {info.code}
            </SyntaxHighlighter>

            <List sx={{ bgcolor: '#333' }} disablePadding>
                {
                    info.answers.map( (answer, index) => (
                        <ListItem key={index} disablePadding divider>
                            <ListItemButton 
                                disabled={ info.userSelectedAnswer != null}
                                onClick={createHandleClick( index )}
                                sx={{
                                    backgroundColor: getBackgroundColor(info, index)
                                }}
                            >
                                <ListItemText sx={{ textAlign: 'center', fontWeight: 'bold' }} primary={answer} />
                            </ListItemButton>
                        </ListItem>
                    ))
                }
            </List>
        </Card>
    )
}

const Game = () => {
  
  const questions = useQuestionsStore( state => state.questions );
  const currentQuestions = useQuestionsStore( state => state.currentQuestion );
  const goNextQuestion = useQuestionsStore( state => state.goNextQuestion );
  const goPreviousQuestion = useQuestionsStore( state => state.goPreviousQuestion );

  const questionInfo = questions[currentQuestions];

  return (
    <>
      <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
        <IconButton onClick={goPreviousQuestion} disabled={currentQuestions === 0}>
          <ArrowBackIcon />
        </IconButton>

        {currentQuestions + 1} / {questions.length}

        <IconButton onClick={goNextQuestion} disabled={currentQuestions >= questions.length - 1}>
          <ArrowForwardIcon />
        </IconButton>
      </Stack>
      <Question info={questionInfo} />

      <Footer />

    </>
  )
}

export default Game