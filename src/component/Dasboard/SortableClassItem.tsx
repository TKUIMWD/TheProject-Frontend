import { ListGroup, Button } from 'react-bootstrap';
import { useSortable } from '@dnd-kit/sortable';
import { Class } from '../../interface/Class/Class';
import { CSS } from '@dnd-kit/utilities';

interface SortableClassItemProps {
    classItem: Class,
    index: number,
    isSelected: boolean,
    onSelect: () => void,
    onDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function SortableClassItem({ classItem, index, isSelected, onSelect, onDelete }: SortableClassItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: `class-${classItem._id}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <ListGroup.Item
                action
                active={isSelected}
                onClick={onSelect}
                className="d-flex justify-content-between align-items-center "
            >
                <span>{`Class ${index + 1}. ${classItem.class_name || "未命名"}`}</span>

                <div onClick={(e) => e.stopPropagation()}>
                    <Button variant="link" {...listeners} className="p-0 text-secondary me-2" style={{ cursor: 'grab' }}>
                        <i className="bi bi-grip-vertical"></i>
                    </Button>
                    <Button variant="link" className="p-0 text-danger" onClick={onDelete}>
                        <i className="bi bi-x-circle"></i>
                    </Button>
                </div>
            </ListGroup.Item>
        </div>
    );
}