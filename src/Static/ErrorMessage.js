import errorImg from '../images/error.png';  

export default function ErrorMessage(props) {
    return (
    <div className="paddingV50">
        <div className="wrapper fullWidth text-center">
            <h1>{props.header}</h1>
            <p className="cleanText">{props.message}</p>
            <img src={errorImg} alt="Что-то пошло не так" className="errorImage" />
        </div>
    </div>
    )
}