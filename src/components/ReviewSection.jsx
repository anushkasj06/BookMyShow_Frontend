import React, { useState, useEffect } from "react";
import axios from "axios";

const ReviewSection = ({ movieId, currentUser }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/reviews/movie/${movieId}`);
                setReviews(response.data);
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            }
        };

        if (movieId) {
            fetchReviews();
        }
    }, [movieId]);

    const handleAddReview = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/reviews/add`, {
                ...newReview,
                userId: currentUser.id,
                movieId: movieId
            });
            setReviews([...reviews, response.data]);
            setNewReview({ rating: 0, comment: "" });
        } catch (error) {
            console.error("Failed to add review", error);
        }
    };

    const handleUpdateReview = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/reviews/update/${editingReview.id}`, {
                rating: editingReview.rating,
                comment: editingReview.comment
            });
            setReviews(reviews.map(r => (r.id === editingReview.id ? response.data : r)));
            setEditingReview(null);
        } catch (error) {
            console.error("Failed to update review", error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API}/reviews/delete/${reviewId}`);
            setReviews(reviews.filter(r => r.id !== reviewId));
        } catch (error) {
            console.error("Failed to delete review", error);
        }
    };

    return (
        <div className="w-full px-16 py-12 bg-pink-50 flex flex-col items-center">
            <div className="w-full max-w-5xl">
                <h3 className="text-2xl font-extrabold mb-8 text-red-600 flex items-center gap-2">
                    <span className="text-3xl">💬</span> Reviews
                </h3>

                {/* Add Review Form */}
                {currentUser && (
                    <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-pink-200 mb-8">
                        <h4 className="text-xl font-bold mb-4">Add Your Review</h4>
                        <div className="flex items-center mb-4">
                            <span className="mr-2">Rating:</span>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                                className="border rounded px-2 py-1 w-20"
                            />
                        </div>
                        <textarea
                            placeholder="Write your comment..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="border rounded px-2 py-1 w-full h-24"
                        ></textarea>
                        <button
                            onClick={handleAddReview}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg mt-4"
                        >
                            Submit Review
                        </button>
                    </div>
                )}

                {/* Display Reviews */}
                <div className="space-y-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl p-8 shadow-xl border-2 border-pink-200">
                            {editingReview && editingReview.id === review.id ? (
                                <div>
                                    <div className="flex items-center mb-4">
                                        <span className="mr-2">Rating:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={editingReview.rating}
                                            onChange={(e) => setEditingReview({ ...editingReview, rating: e.target.value })}
                                            className="border rounded px-2 py-1 w-20"
                                        />
                                    </div>
                                    <textarea
                                        value={editingReview.comment}
                                        onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                                        className="border rounded px-2 py-1 w-full h-24"
                                    ></textarea>
                                    <button onClick={handleUpdateReview} className="bg-green-500 text-white px-4 py-1 rounded-lg mr-2">Save</button>
                                    <button onClick={() => setEditingReview(null)} className="bg-gray-500 text-white px-4 py-1 rounded-lg">Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-red-700">{review.user.name}</span>
                                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="text-pink-400">★ {review.rating}/10</span>
                                    </div>
                                    <p className="text-gray-700 text-base font-medium">{review.comment}</p>
                                    {currentUser && currentUser.id === review.user.id && (
                                        <div className="mt-4">
                                            <button onClick={() => setEditingReview(review)} className="bg-blue-500 text-white px-4 py-1 rounded-lg mr-2">Edit</button>
                                            <button onClick={() => handleDeleteReview(review.id)} className="bg-red-500 text-white px-4 py-1 rounded-lg">Delete</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;