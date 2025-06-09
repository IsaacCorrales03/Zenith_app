import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecureAuthService } from '../services/secure-auth.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonButton,
  IonProgressBar,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonChip,
  IonList,
  IonAlert
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  eyeOutline,
  volumeHighOutline,
  handRightOutline,
  checkmarkCircleOutline,
  arrowForwardOutline,
  arrowBackOutline
} from 'ionicons/icons';

interface Question {
  id: number;
  name: string;
  category: string;
  categoryIcon: string;
}

interface Answer {
  questionId: number;
  rating: number;
}

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonRadioGroup,
    IonRadio,
    IonButton,
    IonProgressBar,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonChip,
    IonList,
    IonAlert
  ]
})

export class EncuestaPage implements OnInit {
  questions: Question[] = [
    // Visual
    { id: 0, name: "Lectura", category: "Visual", categoryIcon: "eye-outline" },
    { id: 1, name: "Gráfico", category: "Visual", categoryIcon: "eye-outline" },
    { id: 2, name: "Diagrama", category: "Visual", categoryIcon: "eye-outline" },
    { id: 3, name: "Video", category: "Visual", categoryIcon: "eye-outline" },
    { id: 4, name: "Imagen", category: "Visual", categoryIcon: "eye-outline" },
    // // Auditivo
    { id: 5, name: "Escuchar clase", category: "Auditivo", categoryIcon: "volume-high-outline" },
    { id: 6, name: "Grabación", category: "Auditivo", categoryIcon: "volume-high-outline" },
    { id: 7, name: "Música", category: "Auditivo", categoryIcon: "volume-high-outline" },
    { id: 8, name: "Podcast", category: "Auditivo", categoryIcon: "volume-high-outline" },
    { id: 9, name: "Debate", category: "Auditivo", categoryIcon: "volume-high-outline" },
    // // Kinestésico
    { id: 10, name: "Experimento", category: "Kinestésico", categoryIcon: "hand-right-outline" },
    { id: 11, name: "Simulación", category: "Kinestésico", categoryIcon: "hand-right-outline" },
    { id: 12, name: "Proyecto", category: "Kinestésico", categoryIcon: "hand-right-outline" },
    { id: 13, name: "Práctica", category: "Kinestésico", categoryIcon: "hand-right-outline" },
    { id: 14, name: "Juego", category: "Kinestésico", categoryIcon: "hand-right-outline" }
  ];
  botones: any[] = []
  answers: Answer[] = [];
  currentQuestionIndex = 0;
  isCompleted = false;
  showResults = false;
  results: any = {};
  isAlertOpen = false;

  constructor(private secureAuthService: SecureAuthService, private apiService: ApiService, private router: Router) {
    addIcons({
      eyeOutline,
      volumeHighOutline,
      handRightOutline,
      checkmarkCircleOutline,
      arrowForwardOutline,
      arrowBackOutline
    });
  }

  ngOnInit() {
    this.botones = [
      {
        text: 'Ver Resultados',
        handler: () => this.showDetailedResults()
      },
      {
        text: 'Reiniciar',
        handler: () => this.restartSurvey()
      }
    ]; this.botones = [
      {
        text: 'Ver Resultados',
        handler: () => this.showDetailedResults()
      },
      {
        text: 'Reiniciar',
        handler: () => this.restartSurvey()
      }
    ];
    // Inicializar respuestas
    this.answers = this.questions.map(q => ({ questionId: q.id, rating: 0 }));
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  get currentAnswer(): Answer {
    return this.answers.find(a => a.questionId === this.currentQuestion.id) || { questionId: this.currentQuestion.id, rating: 0 };
  }

  get progress(): number {
    return (this.currentQuestionIndex + 1) / this.questions.length;
  }

  get canGoNext(): boolean {
    return this.currentAnswer.rating > 0;
  }

  get canGoPrevious(): boolean {
    return this.currentQuestionIndex > 0;
  }

  setRating(rating: number) {
    const answerIndex = this.answers.findIndex(a => a.questionId === this.currentQuestion.id);
    if (answerIndex !== -1) {
      this.answers[answerIndex].rating = rating;
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.completeSurvey();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  completeSurvey() {
    this.isCompleted = true;
    this.calculateResults();

    // Llamar al método del AuthService
    this.secureAuthService.establecer_preferencias(this.answers);
    this.secureAuthService.get_user_percentages().then((preferencias) =>
    {
      this.apiService.establecer_preferencias(preferencias).subscribe({
        next: (data:any) => {
          console.log(data)
        }
      })
      console.log("Petición realizada")
    })
    
    this.router.navigate([''])
  }

  calculateResults() {
    const categories = ['Visual', 'Auditivo', 'Kinestésico'];
    this.results = {};

    categories.forEach(category => {
      const categoryQuestions = this.questions.filter(q => q.category === category);
      const categoryAnswers = categoryQuestions.map(q =>
        this.answers.find(a => a.questionId === q.id)?.rating || 0
      );

      const total = categoryAnswers.reduce((sum, rating) => sum + rating, 0);
      const average = total / categoryAnswers.length;
      const percentage = (average / 5) * 100;

      this.results[category] = {
        total,
        average: Math.round(average * 100) / 100,
        percentage: Math.round(percentage),
        questions: categoryQuestions.length
      };
    });
  }

  showDetailedResults() {
    this.showResults = true;
    this.isAlertOpen = false;
  }

  restartSurvey() {
    this.currentQuestionIndex = 0;
    this.isCompleted = false;
    this.showResults = false;
    this.answers = this.questions.map(q => ({ questionId: q.id, rating: 0 }));
    this.isAlertOpen = false;
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'Visual': return 'primary';
      case 'Auditivo': return 'secondary';
      case 'Kinestésico': return 'tertiary';
      default: return 'medium';
    }
  }

  getRatingText(rating: number): string {
    const texts = ['', 'Muy poco', 'Poco', 'Regular', 'Bastante', 'Mucho'];
    return texts[rating] || '';
  }
}