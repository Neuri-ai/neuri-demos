import './style.css';

const FormFill = () => {
    return (
        <div>

            <section>
        
                    <section class="car">
                        <form className="car-renta">
                            <label>
                                <p>Pick up location</p>
                                <input type="text"></input> 
                            </label>

                            <label>
                                <p>Drop off location</p>
                                <input placeholder="Same as pick up location" type="text"></input> 
                            </label>
                            <article class="pick">

                                <div class="off"> <label>
                                    <p>Pick up Date</p>
                                    <input type="date"></input> 
                                </label>

                                    <label>
                                        <input type="time"></input> 
                                    </label>
                                </div>
                                <div class="off">
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
            </section>

                </div>
                )
}
                export default FormFill