import '../styles/landingInfo.css'

export default function LandingInfo (props) {


    return (
        <section>
            <p className={ props.side ? 'text-side' : 'image-side'}>
                <strong>{props.side ? props.headline : null}</strong> <br></br>
                {props.side ? props.text : <img src={props.image} alt={props.alt} className={props.class}/>} 
            </p>
            <p className={ props.side ? 'image-side' : 'text-side'}>
                <strong>{props.side ? null : props.headline}</strong> <br></br>
                {props.side ? <img src={props.image} alt={props.alt} className={props.class}/> : props.text} 
            </p>
        </section>
    )
}