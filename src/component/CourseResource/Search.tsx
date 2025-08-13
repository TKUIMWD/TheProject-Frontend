import { useState } from "react";
import { Col, Container, Dropdown, Form, Row } from "react-bootstrap";

interface SearchProps {
    handleSearch: (searchTerm: string) => void;
    handleDropdownSelect: (selectedOption: string) => void;
}

export default function Search({ handleSearch, handleDropdownSelect }: SearchProps) {

    const [dropdownOptions, setDropdownOptions] = useState<string>("");

    return (
        <div className="course-resources-search-container container mx-auto mb-5">
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Container>
                        <Row>
                            <Col lg={9} className="d-flex justify-content-end">
                                <Form.Control
                                    type="text"
                                    placeholder="搜尋課程名稱"
                                    onChange={(e) => { handleSearch(e.target.value) }} />
                            </Col>
                            <Col lg={3} className="d-flex justify-content-center">
                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                        {dropdownOptions ? dropdownOptions : "排序方式"}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => { handleDropdownSelect("最高評價"); setDropdownOptions("最高評價"); }}>最高評價</Dropdown.Item>
                                        <Dropdown.Item onClick={() => { handleDropdownSelect("最新課程"); setDropdownOptions("最新課程"); }}>最新課程</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>
            </Form>
        </div>
    );
}