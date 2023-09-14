import { create } from 'zustand';
import { type Question } from '../types';
import confetti from 'canvas-confetti';
import { persist, devtools } from 'zustand/middleware';

// devtools sirve para poder usar el redux devtools

// persist ayuda a persistir el estado en localstorage para que te mantenga la app con el estado aunque recargues


interface State {
    questions: Question[];
    currentQuestion: number;
    fetchQuestions: (limit: number) => Promise<void>
    selectAnswer: (questionId: number, answerIndex: number) => void 
    goNextQuestion: () => void
    goPreviousQuestion: () => void
    reset: () => void
}

// Este questions se puede leer desde cualquier lugar de nuesta app
// el set es para actualizar el estado y el get es para leer el estado
export const useQuestionsStore = create<State>()( devtools( persist(( set, get ) => {
    return {
        // Estados globales
        questions: [],
        currentQuestion: 0, // Posición del array de questions

        // método global
        fetchQuestions: async (limit: number) => {
            const res = await fetch('http://localhost:5173/data.json');
            const json = await res.json()

            const questions = json.sort( () => Math.random() - 0.5).slice(0, limit);

            set({ questions })
        },

        selectAnswer: (questionId: number, answerIndex: number) => {
            // obtenemos los valores del estado con get
            const { questions } = get();

            // usar el structuredClone para clonar objetos 
            const newQuestions = structuredClone( questions );

            // Encontramos el indice de la pregunta
            const questionIndex = newQuestions.findIndex( q => q.id === questionId);

            // recuperamos la información de la pregunta
            const questionInfo = newQuestions[questionIndex];

            // validacion de la respuesta del usuario es correcta
            const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex;

            if(isCorrectUserAnswer) confetti();

            // cambiar la informacion de la copia de la pregunta
            newQuestions[questionIndex] = {
                ...questionInfo,
                isCorrectUserAnswer,
                userSelectedAnswer: answerIndex
            }

            //actualizamos el estado
            set({ questions: newQuestions})
            
        },

        // funcion para ir a la siguiente pregunta
        goNextQuestion: () => {
            const { currentQuestion, questions} = get()
            const nextQuestion = currentQuestion + 1;

            if(nextQuestion < questions.length) {
                set({ currentQuestion: nextQuestion })
            }
        },

        // funcion para ir a la pregunta anterior
        goPreviousQuestion: () => {
            const { currentQuestion } = get()
            const previousQuestion = currentQuestion - 1;

            if( previousQuestion >= 0) {
                set({ currentQuestion: previousQuestion })
            }
        },

        reset: () => {
            set({ currentQuestion: 0, questions: [] })
        }
    }
}, {
    name: 'questions',
})))