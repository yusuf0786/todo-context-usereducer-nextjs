import { useDrag, useDrop } from 'react-dnd';
import { FC, useRef } from 'react';
import Link from 'next/link';

type Category = { id: string; categoryName: string; todos: { id: number; text: string }[] };

interface Props {
  index: number;
  category: Category;
  moveCategory: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  handleOndrop: () => void;
}

const DraggableCategory: FC<Props> = ({ category, index, moveCategory, onEdit, onDelete, handleOndrop }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'CATEGORY',
    hover(item: { index: number }) {
        if (!ref.current) return;

        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        moveCategory(dragIndex, hoverIndex);
        item.index = hoverIndex;
    },

    drop() {
        handleOndrop()
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'CATEGORY',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="flex items-center justify-between p-[0.75rem] border border-gray-300 rounded-sm bg-white h-full"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
    >
        <Link href={`/todolist/${category.id}`} className='text-[#00000090] hover:underline'>{category.categoryName}</Link>
      {/* <div className='text-[#00000090]'>{category.categoryName}</div> */}
      <div className='flex'>
        <button onClick={() => onEdit(category)} className='p-1 me-1'>✏️</button>
        <button onClick={() => onDelete(category)} className='p-1'>🗑️</button>
      </div>
    </div>
  );
};

export default DraggableCategory;
