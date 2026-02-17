export const DataManager = {
  // Key for local storage
  STORAGE_KEY: 'st_marys_data',

  // Initialize data if not present
  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const defaultData = {
        icse: {
          '2024-2025': {
            toppers: [
              { name: 'Aditi Sharma', percentage: 98.4, rank: 1, photo: '/public/images/student-hero.png' },
              { name: 'Rohan Gupta', percentage: 96.8, rank: 2, photo: '/public/images/student-hero.png' },
              { name: 'Karthik R', percentage: 95.2, rank: 3, photo: '/public/images/student-hero.png' },
              { name: 'Sneha P', percentage: 94.5, rank: 4, photo: '/public/images/student-hero.png' },
              { name: 'Vikram S', percentage: 93.0, rank: 5, photo: '/public/images/student-hero.png' },
              { name: 'Ananya M', percentage: 92.8, rank: 6, photo: '/public/images/student-hero.png' },
              { name: 'Rahul K', percentage: 91.5, rank: 7, photo: '/public/images/student-hero.png' },
              { name: 'Priya D', percentage: 90.2, rank: 8, photo: '/public/images/student-hero.png' }
            ],
            stats: {
              appeared: 120,
              ninetyPlus: 45,
              distinction: 78,
              firstClass: 35,
              centums: 12
            }
          }
        },
        sslc: {
          '2024-2025': {
            toppers: [
              { name: 'Meghana K', percentage: 99.2, rank: 1, photo: '/public/images/student-hero.png' },
              { name: 'Suresh B', percentage: 98.8, rank: 2, photo: '/public/images/student-hero.png' },
              { name: 'Lakshmi N', percentage: 97.5, rank: 3, photo: '/public/images/student-hero.png' }
            ],
            stats: {
              appeared: 150,
              ninetyPlus: 60,
              distinction: 90,
              firstClass: 50,
              centums: 15
            }
          }
        }
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultData));
    }
  },

  getData() {
    this.init(); // Ensure init
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
  },

  saveData(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
};
