import { useState, useEffect } from 'react';
import SWPeople from "helpers/StarWarsApi/people.json";
import SWPlanets from "helpers/StarWarsApi/planets.json";
import NMicrophone from 'components/Microphone';
import { Icons } from 'helpers/iconscall'
import './style.css';
import './productfilter.style.scss';
import gsap from 'gsap';

const ProductFilter = () => {
	const [SValue, setSValue] = useState({
		type: 'any', films: 'any', gender: 'any'
	})
	const DataBase = [...SWPeople, ...SWPlanets]
	const [filtered, setFiltered] = useState(DataBase.sort(() => Math.random() - 0.5))
	const [imgClass, setImgClass] = useState('')

	useEffect(() => {
	}, [])

	const filter = (e) => {
		let name = e.target.name; let val = e.target.value;
		const newSValue = { ...SValue, [name]: val }
		setSValue(newSValue);

		let newFilter = DataBase.sort(() => Math.random() - 0.5);

		if (newSValue.type !== 'any') newFilter = newFilter.filter(obj => { return obj.type === newSValue.type })
		if (newSValue.films !== 'any') newFilter = newFilter.filter(obj => { return obj.type === newSValue.films })
		if ((newSValue.type === 'people' && newSValue.gender !== 'any')) newFilter = newFilter.filter(obj => { return obj.gender === newSValue.gender })

		setFiltered(newFilter)
	}

	const InitialDdown = { d1: '', d2: '' }
	const [ddown, setDdrown] = useState(InitialDdown)
	const [ddowndiv, setDdownDiv] = useState('')

	useEffect(() => {
		let tl = gsap.timeline();
		tl.fromTo('#dpfoptions1', {
			scale: 0.5, opacity: 0
		}, { scale: 1, opacity: 1 })
		tl.fromTo('#dpfcardscontainer', {
			opacity: 0
		}, { opacity: 1 })
		tl.fromTo('#microdiv', {
			opacity: 0, scale: 1.5
		}, { opacity: 1, scale: 1 })
	},[])
	const Dropselection = ( ddoption ) => {
		let newDdown = { ...InitialDdown, [ddoption]: ddown[ddoption] === '' ? 'active' : '' }
		setDdrown(newDdown)
		if( newDdown.d1 !== '' || newDdown.d2 !== '' ) return setDdownDiv('show')
		setDdownDiv('')
	}

	return (
		<div id="dpfcontainer">
			<div id="dpfoptions1">
				<div className={`dpfddlist ${ddowndiv}`}></div>
				<div className="dpfselect" onClick={() => Dropselection('d1')}>
					<p>Type</p>
					<img className={`${ddown.d1}`} src={Icons.Arrow} alt="arrow" />
				</div>
				<div className="dpfselect" onClick={() => Dropselection('d2')}>
					<p>Films</p>
					<img className={`${ddown.d2}`} src={Icons.Arrow} alt="arrow" />
				</div>
				{
					SValue.type === 'people' &&
					<>
						<div className="dpfselect">
							<p>Gender:</p>
							<select name='gender' defaultValue={SValue.gender} onChange={(e) => filter(e)}>
								<option value="any" selected>Any</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						</div>
					</>
				}
			</div>
			<div id="dpfcardscontainer">
				{filtered.map((item, key) => {
					return (
						<div className="pfcards" key={key}>
							<div className="dpfimage">
								<img src={item.image} alt="ilustrative" />
							</div>
							<div className="pfinfo">
								{item.name !== undefined && <div className="pfseparator"><p>Name:</p><p>{item.name}</p></div>}
								{item.gender !== undefined && <div className="pfseparator"><p>Gender:</p><p>{item.gender}</p></div>}
								{item.height !== undefined && <div className="pfseparator"><p>Height:</p><p>{item.height} cm</p></div>}
								{item.homeworld !== undefined && <div className="pfseparator"><p>Home world:</p><p>{item.homeworld}</p></div>}
								{item.population !== undefined && <div className="pfseparator"><p>Population:</p><p>{item.population}</p></div>}
								{item.gravity !== undefined && <div className="pfseparator"><p>Gravity:</p><p>{item.gravity}</p></div>}
								{item.terrain !== undefined && <div className="pfseparator"><p>Terrain:</p><p>{item.terrain}</p></div>}
							</div>
						</div>
					)
				})}
			</div>
			<div id="microdiv" onClick={() => setImgClass( imgClass === '' ? 'active' : '' )}>
				<NMicrophone state={imgClass} />
			</div>
		</div>
	)
}
export default ProductFilter