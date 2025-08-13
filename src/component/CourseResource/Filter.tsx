import { useState } from "react";
import { Form, ListGroup } from "react-bootstrap";

interface FillterProps {
    handleFilter: (difficulty: string | null, rating: string | null) => void;
}

export default function Filter({ handleFilter }: FillterProps) {
    const difficultyOptions = ["All", "Easy", "Medium", "Hard"];
    const ratingOptions = ["All", "4.0 ~ 5.0", "3.0 ~ 3.9", "2.0 ~ 2.9", "1.0 ~ 1.9", "0.0 ~ 0.9"];

    const [difficulty, setDifficulty] = useState<string>("All");
    const [rating, setRating] = useState<string>("All");

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDifficulty(event.target.value);
        handleFilter(event.target.value, rating);
    }

    const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRating(event.target.value);
        handleFilter(difficulty, event.target.value);
    }

    return (
        <div className="course-resources-filter-container container mx-auto mb-5">
            <h5>篩選課程</h5>
            <ListGroup>
                <ListGroup.Item>
                    <p>課程難度</p>
                    {difficultyOptions.map((option) => (
                        <Form.Check
                            type={'radio'}
                            name="diff"
                            label={option}
                            key={option}
                            value={option}
                            checked={difficulty === option} // 由 state 決定是否被選中
                            onChange={handleDifficultyChange}
                        />
                    ))}
                </ListGroup.Item>
                <ListGroup.Item>
                    <p>課程評價</p>
                    {ratingOptions.map((option) => (
                        <Form.Check
                            type={'radio'}
                            name="rate"
                            label={<><i className="bi bi-star-fill text-warning"></i>  {option}</>}
                            key={option}
                            value={option}
                            checked={rating === option} // 由 state 決定是否被選中
                            onChange={handleRatingChange}
                        />
                    ))}
                </ListGroup.Item>
            </ListGroup>
        </div>
    );
}