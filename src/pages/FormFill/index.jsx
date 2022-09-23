import './style.css';

const FormFill = () => {
    return (
        <section className="car">
            <form className="car-renta">
                <label>
                    <p>Pick up location</p>
                    <input type="text"></input>
                </label>

                <label>
                    <p>Drop off location</p>
                    <input placeholder="Same as pick up location" type="text"></input>
                </label>
                <article className="pick">

                    <div className="off"> <label>
                        <p>Pick up Date</p>
                        <input type="date"></input>
                    </label>

                        <label>
                            <input type="time"></input>
                        </label>
                    </div>
                    <div className="off">
                        <label>
                            <p>Drop off Date</p>
                            <input type="date"></input>
                        </label>
                        <label>
                            <input type="time"></input>
                        </label>
                    </div>
                    <button type="submit">Search</button>
                </article>
            </form>
        </section>
    )
}
export default FormFill