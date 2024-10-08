import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Profile.scss'
import { useState } from 'react';
import { addNewPost } from '../../services/ApiService';
import { toast } from 'react-toastify';

type modalProps = {
    show: boolean,
    setShowModalAddNew: (show: boolean) => void,
    tags: string[],
    getPostsByPage: () => void
}


const ModalAddNewPost = (props: modalProps) => {
    const { show, setShowModalAddNew, tags, getPostsByPage } = props;
    const [selectTags, setSelectTags] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    const handleClose = () => {
        setShowModalAddNew(false);
        setTitle('');
        setDescription('');
        setSelectTags([]);
    }

    const handleSelectTags = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tag = e.target.value;
        setSelectTags(prevState =>
            prevState.includes(tag)
                ? prevState.filter(valu => valu !== tag)
                : [...prevState, tag]
        )
    }


    const handleAddNewPost = async () => {
        if (!title) {
            toast.error('Title Not Empty');
        } else if (!description) {
            toast.error('Description Not Empty');
        } else {
            const formatTags: object[] = selectTags.map((tag) => ({ tag: tag }))
            const res = await addNewPost(title, description, formatTags);
            if (res && res.data) {
                toast.success('Add New Post Successfully');
                handleClose();
                getPostsByPage();
            } else {
                toast.error('Add New Post Failure')
            }
        }

    }


    return (
        <div>
            <Modal size='xl' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Posts</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='input'>
                        <div className='input__title'>
                            <label>Title</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} type="text" />
                        </div>
                        <div className='input__description'>
                            <label>Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                    </div>
                    <label className='mt-5 mb-2'>Tags</label>
                    <div className='selecttag'>
                        {
                            tags.map((tag, index) =>
                                <div key={index}>
                                    <input value={tag} type="checkbox" checked={selectTags.includes(tag)} onChange={handleSelectTags} />
                                    <span className='mx-2'>{tag}</span>
                                </div>
                            )
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddNewPost}>
                        Add New
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalAddNewPost;