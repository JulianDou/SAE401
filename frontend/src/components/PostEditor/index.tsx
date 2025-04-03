import { useState, useRef, useEffect } from 'react';
import { api_url } from '../../data/loaders';

import ProfilePic from '../../ui/ProfilePic';
import Username from '../../ui/Username';

interface PostEditorProps {
    id: number;
    username: string;
    mode?: string;
    postId?: number;
}

export default function PostEditor(props: PostEditorProps) {
    const [open, setOpen] = useState(props.mode === 'reply' ? true : false);
    const [message, setMessage] = useState('');
    const [popupOpen, setPopupOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [characters, setCharacters] = useState(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    let currentTime = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [open]);

    const handleInput = () => {
        // Update current time on input
        currentTime = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            setCharacters(textareaRef.current.value.length);
        }
    };
    
    const resetInput = () => {
        if (textareaRef.current) {
            textareaRef.current.value = '';
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            setCharacters(0);
            setCancelling(false);
        }
    }

    const getInput = () => {
        if (textareaRef.current) {
            return textareaRef.current.value;
        }
    }

    function handleSubmit() {
        const token = localStorage.getItem("auth_token");

        const text = getInput();
        const data = {
            text: text,
        }

        if (props.mode === 'reply') {
            fetch (api_url + "reply/to/" + props.postId, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                },
                body: JSON.stringify(data),
            })
            .then((response) => {
                const res = response.json();
                if (!response.ok) {
                    return res.then((err) => {
                        throw new Error(err.message || "An error occurred...");
                    });
                }
                res.then((data) => {
                    if (data.message === undefined) {
                        setPopupOpen(true);
                        setMessage("An unexpected error occurred...");
                    }
                    else {
                        setPopupOpen(true);
                        setMessage(data.message);
                    }
                })
            })
            .catch((error) => {
                setPopupOpen(true);
                setMessage(error.message);
            });
            return;
        }

        fetch (api_url + "posts", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            const res = response.json();
            if (!response.ok) {
                return res.then((err) => {
                    throw new Error(err.message || "An error occurred...");
                });
            }
            res.then((data) => {
                if (data.message === undefined) {
                    setPopupOpen(true);
                    setMessage("An unexpected error occurred...");
                    return;
                }
                else {
                    setPopupOpen(true);
                    setMessage(data.message);
                    return;
                }
            })
        })
        .catch((error) => {
            setPopupOpen(true);
            setMessage(error.message);
        });
    }


    return (
        <div className={`
            flex justify-center items-center gap-2.5 self-stretch relative
            border-t-[1px] border-main-grey     
            ${props.mode === 'reply' ? '' : 'md:px-[25%] py-5 px-2.5'}
        `}>
            <div className={`flex flex-col items-center gap-8 mt-2 w-full md:my-8 ${
                open ? 
                    props.mode === 'reply' ?
                        'visible'
                        : 'visible mb-64 md:min-w-96'
                    : 'hidden'
                }`
            }>
                <div className="flex gap-3 w-full">
                    <ProfilePic username={props.username} id={props.id} size={3}/>
                    <div className="flex flex-col gap-2.5 flex-auto">
                        <div className="flex md:justify-between flex-col md:flex-row">
                            <Username username={props.username} id={props.id} />
                            <p className="text-main-slate">{currentTime}</p>
                        </div>
                        <textarea 
                            id="post-editor"
                            ref={textareaRef}
                            maxLength={280}
                            placeholder={"Enter your " + (props.mode === "reply" ? 'reply' : 'text') + " here..." }
                            className="w-full text-main-slate active:border-0
                            focus:outline-none focus:border-0 resize-none"          
                            onInput={handleInput}
                        />
                        <p className={characters > 0 ? (characters == 280 ? 'text-main-red' : 'text-main-grey') : 'hidden'}>{characters} / 280</p>
                        {/* <div className="flex h-64 flex-col justify-center items-center bg-main-grey rounded-lg hover:cursor-pointer">
                            <div className="w-12 h-12 flex items-center justify-center p-1 aspect-square rounded-full bg-main-white">
                                <p className="text-main-grey text-2xl font-bold line -translate-y-[3px]">+</p>
                            </div>
                            <p className="text-main-slate">Add Image</p>
                        </div> */}
                    </div>
                </div>
                <div className={`${characters > 0 ? 'visible' : 'hidden'} flex w-full gap-4 justify-center md:justify-between`}>
                    <button onClick={() => setCancelling(true)} className="flex justify-center w-24 p-2.5 rounded-4xl border-main-red border-2 text-main-red hover:cursor-pointer">Cancel</button>
                    <button onClick={handleSubmit} className="flex justify-center w-36 p-2.5 rounded-4xl bg-main-black text-white hover:cursor-pointer">Post</button>
                </div>
            </div>
            <div className={`${cancelling ? 'visible' : 'hidden'} absolute w-full h-full flex justify-center items-center backdrop-blur-xs`}>
                <div className="flex flex-col p-8 gap-4 bg-white rounded shadow-lg">
                    <p>Are you sure you want to cancel writing ?</p>
                    <div className="flex w-full h-fit gap-4 justify-center">
                        <button onClick={() => setCancelling(false)} className="flex h-fit justify-center p-2.5 rounded-4xl border-main-red border-2 text-main-red hover:cursor-pointer">
                            No, keep my {props.mode === 'reply' ? 'reply' : 'post'}
                        </button>
                        <button onClick={() => resetInput()} className="flex h-fit justify-center p-2.5 rounded-4xl bg-main-red text-white hover:cursor-pointer">
                            Yes, cancel
                        </button>
                    </div>
                </div>
            </div>
            <div className={`${popupOpen ? 'visible' : 'hidden'} absolute w-full h-full flex justify-center items-center backdrop-blur-xs`}>
                <div className="flex flex-col p-8 gap-4 bg-white rounded shadow-lg">
                    <p>{message}</p>
                    <div className="flex w-full h-fit gap-4 justify-center">
                        <button onClick={() => {setPopupOpen(false); resetInput()}} className="flex h-fit justify-center p-2.5 rounded-4xl bg-main-black text-white hover:cursor-pointer">Got it</button>
                    </div>
                </div>
            </div>
            {
                props.mode !== 'reply' &&
                <button className="
                        w-14 h-14 p-1 aspect-square rounded-full bg-main-white text-main-white absolute
                        left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 hover:cursor-pointer
                    "
                    onClick={() => setOpen(!open)}
                >
                    <div className="w-full h-full rounded-full bg-main-black flex items-center justify-center">
                            <p className={open ? 'text-2xl font-bold line -translate-y-0.5 translate-x-0.5 rotate-45' : 'text-2xl font-bold line -translate-y-0.5'}>+</p>
                    </div>
                </button>
            }
        </div>
    );
}