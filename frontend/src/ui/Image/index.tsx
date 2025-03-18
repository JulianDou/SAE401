

interface ImageProps {
    src: string;
    alt: string;
    maxHeight?: number;
}

export default function Image(props: ImageProps) {

    return (
        <div 
            className="relative flex flex-col rounded-lg  items-center justify-center w-full overflow-hidden"
            style={{ 
                maxHeight: props.maxHeight
            }}         
        >
            <img 
                src={props.src} 
                alt={props.alt} 
                className='absolute -z-50 w-full h-full object-cover blur-lg brightness-75'
            />
            <img 
                src={props.src} 
                alt={props.alt} 
                className='relative h-full object-contain shadow-2xl'
            />
        </div>
    );
}