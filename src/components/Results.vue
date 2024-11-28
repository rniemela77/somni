<template>
    <div>
        <h2>Your Quiz Results</h2>
        <p v-if="loading">Loading...</p>
        <p v-else-if="!results.length">No results found.</p>
        <ul v-else>
            <li v-for="(result, index) in results" :key="index">
                <strong>{{ result.questionText }}</strong><br />
                Your Answer: {{ result.userAnswer }}
            </li>
        </ul>
    </div>
</template>

<script>
import { db } from "../../firebase";
import {
    doc,
    getDoc,
    query,
    collection,
    where,
    getDocs,
    orderBy,
    limit
} from "firebase/firestore";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default {
    data() {
        return {
            results: [],
            loading: true,
        };
    },
    async mounted() {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.error("User not logged in");
                this.loading = false;
                return;
            }
            const userId = user.uid;

            try {
                // Fetch the user's most recent quiz result
                const resultsQuery = query(
                    collection(db, "results"),
                    where("userId", "==", userId),
                    orderBy("timestamp", "desc"),
                    limit(1)
                );
                const resultsSnapshot = await getDocs(resultsQuery);

                if (resultsSnapshot.empty) {
                    console.error("No results found for this user.");
                    this.loading = false;
                    return;
                }

                // Get the most recent result
                const resultsData = resultsSnapshot.docs[0].data();

                // Fetch quiz questions to match IDs with text
                const quizDocRef = doc(db, "quizzes", "quiz1"); // Replace 'quiz1' with the appropriate quiz ID
                const quizDoc = await getDoc(quizDocRef);

                if (!quizDoc.exists()) {
                    console.error("Quiz not found");
                    this.loading = false;
                    return;
                }

                const quizData = quizDoc.data();

                // Combine questions and user's most recent answers
                const combinedResults = quizData.questions.map((question) => ({
                    questionText: question.text,
                    userAnswer: resultsData.answers[question.id],
                }));

                this.results = combinedResults;
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                this.loading = false;
            }
        });
    },
};
</script>


<style scoped>
ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 15px;
}

strong {
    color: #333;
}
</style>