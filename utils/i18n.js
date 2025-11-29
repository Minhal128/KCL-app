// Simple i18n implementation
const translations = {
  en: {
    // Common
    welcome: 'Welcome',
    guest: 'Guest',
    search: 'Search',
    cancel: 'Cancel',
    save: 'Save',
    continue: 'Continue',
    skip: 'Skip for now',
    back: 'Back',
    yes: 'Yes',
    no: 'No',
    
    // Home Screen
    searchMovies: 'Search movies, series',
    featuredContent: 'Featured Content',
    trendingMovies: 'Trending Movies',
    topTVSeries: 'Top TV Series',
    seeMore: 'See More',
    
    // Profile
    editProfile: 'Edit Profile',
    fullName: 'Full Name',
    username: 'Username',
    emailAddress: 'Email Address',
    mobileNumber: 'Mobile Number',
    location: 'Location',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    videoQuality: 'Video quality',
    notifications: 'Notifications',
    subscription: 'Subscription',
    support: 'Support',
    logout: 'Logout',
    privacy: 'Privacy',
    help: 'Help center',
    about: 'About us',
    
    // Subscription
    choosePlan: 'Choose the plan that\nbest works for you',
    personalizeExperience: "Let's help you personalize your experience",
    basicPlan: 'Basic Plan',
    standard: 'Standard',
    premium: 'Premium',
    perMonth: '/Month',
    continueToPayment: 'Continue to Payment',
    
    // Support
    createTicket: 'Create Support Ticket',
    subject: 'Subject',
    description: 'Description',
    category: 'Category',
    priority: 'Priority',
    yourTickets: 'Your Tickets',
    
    // Auth
    signIn: 'Sign in',
    signUp: 'Sign up',
    forgotPassword: 'Forgot Password?',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    
    // Messages
    success: 'Success',
    error: 'Error',
    profileUpdated: 'Profile updated successfully!',
    languageUpdated: 'Language updated',
    ticketCreated: 'Support ticket created successfully',
  },
  
  fr: {
    // Common
    welcome: 'Bienvenue',
    guest: 'Invité',
    search: 'Rechercher',
    cancel: 'Annuler',
    save: 'Enregistrer',
    continue: 'Continuer',
    skip: 'Passer pour le moment',
    back: 'Retour',
    yes: 'Oui',
    no: 'Non',
    
    // Home Screen
    searchMovies: 'Rechercher des films, séries',
    featuredContent: 'Contenu en vedette',
    trendingMovies: 'Films tendance',
    topTVSeries: 'Meilleures séries TV',
    seeMore: 'Voir plus',
    
    // Profile
    editProfile: 'Modifier le profil',
    fullName: 'Nom complet',
    username: "Nom d'utilisateur",
    emailAddress: 'Adresse e-mail',
    mobileNumber: 'Numéro de mobile',
    location: 'Emplacement',
    
    // Settings
    settings: 'Paramètres',
    language: 'Langue',
    videoQuality: 'Qualité vidéo',
    notifications: 'Notifications',
    subscription: 'Abonnement',
    support: 'Assistance',
    logout: 'Déconnexion',
    privacy: 'Confidentialité',
    help: 'Centre d\'aide',
    about: 'À propos de nous',
    
    // Subscription
    choosePlan: 'Choisissez le forfait qui\nvous convient le mieux',
    personalizeExperience: 'Laissez-nous vous aider à personnaliser votre expérience',
    basicPlan: 'Forfait de base',
    standard: 'Standard',
    premium: 'Premium',
    perMonth: '/Mois',
    continueToPayment: 'Continuer vers le paiement',
    
    // Support
    createTicket: 'Créer un ticket de support',
    subject: 'Sujet',
    description: 'Description',
    category: 'Catégorie',
    priority: 'Priorité',
    yourTickets: 'Vos tickets',
    
    // Auth
    signIn: 'Se connecter',
    signUp: "S'inscrire",
    forgotPassword: 'Mot de passe oublié?',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    dontHaveAccount: "Vous n'avez pas de compte?",
    
    // Messages
    success: 'Succès',
    error: 'Erreur',
    profileUpdated: 'Profil mis à jour avec succès!',
    languageUpdated: 'Langue mise à jour',
    ticketCreated: 'Ticket de support créé avec succès',
  },
  
  es: {
    // Common
    welcome: 'Bienvenido',
    guest: 'Invitado',
    search: 'Buscar',
    cancel: 'Cancelar',
    save: 'Guardar',
    continue: 'Continuar',
    skip: 'Omitir por ahora',
    back: 'Atrás',
    yes: 'Sí',
    no: 'No',
    
    // Home Screen
    searchMovies: 'Buscar películas, series',
    featuredContent: 'Contenido destacado',
    trendingMovies: 'Películas en tendencia',
    topTVSeries: 'Mejores series de TV',
    seeMore: 'Ver más',
    
    // Profile
    editProfile: 'Editar perfil',
    fullName: 'Nombre completo',
    username: 'Nombre de usuario',
    emailAddress: 'Correo electrónico',
    mobileNumber: 'Número de móvil',
    location: 'Ubicación',
    
    // Settings
    settings: 'Configuración',
    language: 'Idioma',
    videoQuality: 'Calidad de video',
    notifications: 'Notificaciones',
    subscription: 'Suscripción',
    support: 'Soporte',
    logout: 'Cerrar sesión',
    privacy: 'Privacidad',
    help: 'Centro de ayuda',
    about: 'Acerca de nosotros',
    
    // Subscription
    choosePlan: 'Elige el plan que\nmejor se adapte a ti',
    personalizeExperience: 'Permítenos ayudarte a personalizar tu experiencia',
    basicPlan: 'Plan básico',
    standard: 'Estándar',
    premium: 'Premium',
    perMonth: '/Mes',
    continueToPayment: 'Continuar al pago',
    
    // Support
    createTicket: 'Crear ticket de soporte',
    subject: 'Asunto',
    description: 'Descripción',
    category: 'Categoría',
    priority: 'Prioridad',
    yourTickets: 'Tus tickets',
    
    // Auth
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    forgotPassword: '¿Olvidaste tu contraseña?',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    
    // Messages
    success: 'Éxito',
    error: 'Error',
    profileUpdated: '¡Perfil actualizado exitosamente!',
    languageUpdated: 'Idioma actualizado',
    ticketCreated: 'Ticket de soporte creado exitosamente',
  },
  
  ru: {
    // Common
    welcome: 'Добро пожаловать',
    guest: 'Гость',
    search: 'Поиск',
    cancel: 'Отмена',
    save: 'Сохранить',
    continue: 'Продолжить',
    skip: 'Пропустить',
    back: 'Назад',
    yes: 'Да',
    no: 'Нет',
    
    // Home Screen
    searchMovies: 'Поиск фильмов, сериалов',
    featuredContent: 'Избранное',
    trendingMovies: 'Популярные фильмы',
    topTVSeries: 'Лучшие сериалы',
    seeMore: 'Показать больше',
    
    // Profile
    editProfile: 'Редактировать профиль',
    fullName: 'Полное имя',
    username: 'Имя пользователя',
    emailAddress: 'Адрес электронной почты',
    mobileNumber: 'Номер телефона',
    location: 'Местоположение',
    
    // Settings
    settings: 'Настройки',
    language: 'Язык',
    videoQuality: 'Качество видео',
    notifications: 'Уведомления',
    subscription: 'Подписка',
    support: 'Поддержка',
    logout: 'Выйти',
    privacy: 'Конфиденциальность',
    help: 'Справочный центр',
    about: 'О нас',
    
    // Subscription
    choosePlan: 'Выберите план,\nкоторый вам подходит',
    personalizeExperience: 'Позвольте нам помочь вам персонализировать ваш опыт',
    basicPlan: 'Базовый план',
    standard: 'Стандарт',
    premium: 'Премиум',
    perMonth: '/Месяц',
    continueToPayment: 'Перейти к оплате',
    
    // Support
    createTicket: 'Создать тикет поддержки',
    subject: 'Тема',
    description: 'Описание',
    category: 'Категория',
    priority: 'Приоритет',
    yourTickets: 'Ваши тикеты',
    
    // Auth
    signIn: 'Войти',
    signUp: 'Зарегистрироваться',
    forgotPassword: 'Забыли пароль?',
    alreadyHaveAccount: 'Уже есть аккаунт?',
    dontHaveAccount: 'Нет аккаунта?',
    
    // Messages
    success: 'Успех',
    error: 'Ошибка',
    profileUpdated: 'Профиль успешно обновлен!',
    languageUpdated: 'Язык обновлен',
    ticketCreated: 'Тикет поддержки успешно создан',
  },
  
  jp: {
    // Common
    welcome: 'ようこそ',
    guest: 'ゲスト',
    search: '検索',
    cancel: 'キャンセル',
    save: '保存',
    continue: '続ける',
    skip: '今はスキップ',
    back: '戻る',
    yes: 'はい',
    no: 'いいえ',
    
    // Home Screen
    searchMovies: '映画、シリーズを検索',
    featuredContent: '注目のコンテンツ',
    trendingMovies: 'トレンド映画',
    topTVSeries: 'トップTVシリーズ',
    seeMore: 'もっと見る',
    
    // Profile
    editProfile: 'プロフィール編集',
    fullName: 'フルネーム',
    username: 'ユーザー名',
    emailAddress: 'メールアドレス',
    mobileNumber: '携帯電話番号',
    location: '場所',
    
    // Settings
    settings: '設定',
    language: '言語',
    videoQuality: 'ビデオ品質',
    notifications: '通知',
    subscription: 'サブスクリプション',
    support: 'サポート',
    logout: 'ログアウト',
    privacy: 'プライバシー',
    help: 'ヘルプセンター',
    about: 'について',
    
    // Subscription
    choosePlan: 'あなたに最適な\nプランを選択',
    personalizeExperience: 'あなたの体験をパーソナライズしましょう',
    basicPlan: 'ベーシックプラン',
    standard: 'スタンダード',
    premium: 'プレミアム',
    perMonth: '/月',
    continueToPayment: '支払いに進む',
    
    // Support
    createTicket: 'サポートチケット作成',
    subject: '件名',
    description: '説明',
    category: 'カテゴリー',
    priority: '優先度',
    yourTickets: 'あなたのチケット',
    
    // Auth
    signIn: 'サインイン',
    signUp: 'サインアップ',
    forgotPassword: 'パスワードをお忘れですか？',
    alreadyHaveAccount: 'すでにアカウントをお持ちですか？',
    dontHaveAccount: 'アカウントをお持ちではありませんか？',
    
    // Messages
    success: '成功',
    error: 'エラー',
    profileUpdated: 'プロフィールが正常に更新されました！',
    languageUpdated: '言語が更新されました',
    ticketCreated: 'サポートチケットが正常に作成されました',
  },
};

export const getTranslation = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations['en'][key] || key;
};

export const t = getTranslation;

export default translations;
