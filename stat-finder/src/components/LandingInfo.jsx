import '../styles/landingInfo.css'

export default function LandingInfo (props) {
    return (
        <section>
            <p className={ props.side ? 'text-side' : 'image-side'}>
                <strong>{props.side ? props.headline : null}</strong> <br></br>
                {props.side ? props.text : props.image} 
            </p>
            <p className={ props.side ? 'image-side' : 'text-side'}>
                <strong>{props.side ? null : props.headline}</strong> <br></br>
                {props.side ? props.image : props.text} 
            </p>
        </section>
    )
}