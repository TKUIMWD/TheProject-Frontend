import { useState, useMemo } from "react";
import { Button, Col, Container, Row, Form, ListGroup } from "react-bootstrap";
import '../../style/dashboard/AddChapterForm.css'; 


interface AddChapterFormProps {
    handleTabChange: (key: "prev" | "next") => void;
}

export default function AddChapterForm({ handleTabChange }: AddChapterFormProps) {
    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group controlId="formChapterTitle">
                                <Form.Label>Chapter Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter chapter title" />
                            </Form.Group>

                            <Form.Group controlId="formChapterContent">
                                <Form.Label>Chapter Content</Form.Label>
                                <Form.Control as="textarea" rows={5} placeholder="Enter chapter content" />
                            </Form.Group>

                            <Button variant="secondary" onClick={() => handleTabChange("prev")}>
                                上頁
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}