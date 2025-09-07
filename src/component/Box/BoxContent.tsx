import { Tab, Tabs } from "react-bootstrap";
import { VM_Box_Info } from "../../interface/VM/VM_Box";
import BoxOverview from "./BoxOverview";
import "../../style/Box/BoxContent.css";
import BoxReviews from "./BoxReviews";
import BoxAnswerArea from "./BoxAnswerArea";



export default function BoxContent({ box }: { box: VM_Box_Info }) {
    return (
        <div className="box-content">
            <Tabs
                defaultActiveKey="overview"
                id="uncontrolled-tab-example"
                fill
            >
                <Tab eventKey="overview" title="總覽">
                    <BoxOverview box={box}/>
                </Tab>
                <Tab eventKey="answer-area" title="作答區">
                    <BoxAnswerArea box={box}/>
                </Tab>
                <Tab eventKey="reviews" title="留言">
                    <BoxReviews box={box}/>
                </Tab>
                <Tab eventKey="walkthroughs" title="walkthroughs">
                    <div className="tab-pane-content">
                        Tab content for Walkthroughs
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}