import { Breadcrumb } from "react-bootstrap";
import { VM_Box_Info } from "../../interface/VM/VM_Box";
import "../../style/Box/BoxHeader.css";
import Image from "react-bootstrap/Image";

export default function BoxHeader({ box }: { box: VM_Box_Info }) {
    const imageUrl = "/src/assets/images/BoxResource/banner.jpg";

    return (
        <div className="box-header">
            <Image className="box-header-img" src={imageUrl} fluid />

            <div className="box-header-title">
                <h1>{box.name}</h1>
                <Breadcrumb>
                    <Breadcrumb.Item href="/boxResources">Box資源</Breadcrumb.Item>
                    <Breadcrumb.Item active>{box.name}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        </div>
    );
}