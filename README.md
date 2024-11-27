# echos.me: Curate Your Echo Chambers

**Tagline**: "Create your personalized echo chambers, tailor the noise, and dive into your world of news."

## Project Overview

echos.me is a news aggregation platform where users can create custom feeds, or "Chambers," by selecting language, categories, and keywords. This app allows you to organize and curate your news consumption based on your preferences.

Key Features:

- **Newsfeed**: A dynamic feed with infinite scrolling that reflects the user's selected preferences.
- **Chambers**: Personalized echo chambers created with specific categories and keywords, accessible at any time.
- **Favorites**: Save articles you love for quick access later.
- **Keyword Filtering**: Search for articles using keywords to narrow down your feed.
- **Get Started Guide**: A helpful walkthrough to onboard new users.

---

## Features and Architecture

### Newsfeed

The Newsfeed dynamically fetches and displays articles from the Mediastack API. Key features include:

- **Infinite Scrolling**: Automatically fetches new articles when the user scrolls down.
- **Keyword Filtering**: Allows users to refine articles by keywords.
- **Favorite and Share Actions**: Articles can be favorited for later access or shared using the Web Share API.
- **State Caching**: Previously fetched articles are cached to reduce API calls and improve load times.

---

### Chambers

Chambers are user-defined news collections based on their preferred filters. They act as dedicated "feeds" that reflect the user's choices:

- **Create a Chamber**: Users can create Chambers using preferences and keywords.
- **Persistent Storage**: Chambers are saved in a Supabase database for each user.
- **Clean UI**: Displayed as cards, Chambers provide a quick snapshot of their filters and offer an easy click-to-access feed.

---

### SearchBar

The `SearchBar` component provides an intuitive way to refine the Newsfeed:

- **Real-time Keyword Updates**: Keywords are added and reflected in the feed dynamically.
- **Keyword Persistence**: Allows users to adjust keywords on-the-fly while ensuring they persist across sessions.
- **Clear and Interactive UI**: Keywords are displayed as removable tags, enhancing the user experience.

---

### Authentication

Authentication is powered by Supabase. Users can:

- **Sign Up**: Create a new account with email and password.
- **Login**: Access their account securely.
- **Logout**: Log out of the app, clearing session data.

---

### Technologies Used

This app leverages modern web technologies and frameworks:

- **React.js**: Frontend library for building the user interface.
- **Supabase**: Backend-as-a-service for authentication and database storage.
- **Mediastack API**: Fetches real-time news data.
- **React-Bootstrap**: Provides styled components for a responsive design.
- **FontAwesome**: Icons for interactivity and improved user experience.

---

## Installation

To run the app locally:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to porject directory:
   ```bash
   cd capstone-project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Add the following .env variables:
   REACT_APP_MEDIASTACK_API_KEY=<your-mediastack-api-key>
   REACT_APP_SUPABASE_URL=<your-supabase-url>
   REACT_APP_SUPABASE_ANON_KEY=<your-supabase-anon-key>

5. Start dev server:
   ```bash
   npm start
   ```

## Pages Overview

### 1. **HomePage**

- Landing page for all users.
- Features quick access to Newsfeed and Chambers.

### 2. **Signup and Login**

- Signup.js and Login.js manage user authentication via Supabase.

### 3. **Newsfeed**

- Displays articles dynamically based on user preferences.
- Features:
  - Infinite scrolling.
  - Keyword filtering.
  - Favorite and share functionalities.

### 4. **Chambers**

- Displays user-created chambers.
- Allows users to manage (view or delete) their chambers.

### 5. **Chamber**

- Dedicated page for each chamber.
- Mimics the Newsfeed but tailored to the chamber's saved filters.

### 6. **Favorites**

- Displays all favorited articles.

### 7. **Get Started**

- Walkthrough for new users to understand the app's features.

---

## Tests

Tests have been written for the following pages and components:

- `Signup.js` and `Login.js`: Ensures user authentication flows work correctly.
- `FavoritedArticles.js`: Verifies that favoriting functionality is consistent.
- `Chambers.js` and `Chamber.js`: Tests for chamber creation and navigation.
- `SearchBar.js` and `SettingsCard.js`: Focused on filter updates and UI interactions.
- `Logout.js`: Confirms the logout functionality works and redirects properly.

### Running Tests

To execute the tests, run:

```bash
npm test
```

---

## Usage Instructions

1. **Login or Sign Up**: Create an account or log in to your existing one.
2. **Explore the Newsfeed**:
   - Adjust preferences via the SettingsCard.
   - Search for articles using the SearchBar.
3. **Create Chambers**: Save filters and keywords to revisit customized feeds later.
4. **Favorite Articles**: Save articles for later reading.

---

## Future Enhancements

While there are no planned updates, potential improvements could include:

- **Social Sharing of Chambers**: Allow users to share their chambers with others.
- **Enhanced Keyword Suggestions**: Dynamically suggest keywords based on popular trends.
