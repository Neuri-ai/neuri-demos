import { useState, useEffect } from 'react';
import SWApi from "helpers/StarWarsApi/StarWarsApi.json";
import NMicrophone from 'components/Microphone';
import { Icons } from 'helpers/iconscall'
import './productfilter.style.scss';
import { gsap, Power3 } from 'gsap';

const ProductFilter = () => {
	const [SValue, setSValue] = useState(SWApi["initialFilter"])
	const DataBase = [...SWApi["people"], ...SWApi["planets"]]
	const [filtered, setFiltered] = useState(DataBase.sort(() => Math.random() - 0.5))
	const [imgClass, setImgClass] = useState('')

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
	}, [])

	const [ddownvalue, setDdownValue] = useState('type')
	const filteropt = SWApi['filter-options']

	const Dropselection = (opt1, opt2) => {
		const newSValue = { ...SValue, [opt1]: opt2 }
		setSValue(newSValue);

		let newFilter = DataBase.sort(() => Math.random() - 0.5);

		if (newSValue.type !== 'any') newFilter = newFilter.filter(obj => { return obj.type === newSValue.type })
		if (newSValue.films !== 'any') {
			newFilter = newFilter.filter(obj => {
				if (obj.films === undefined) return null
				if (obj.films.includes(newSValue.films) === true) {
					return obj
				}
			})
		}
		if ((newSValue.type === 'people' && newSValue.gender !== 'any')) newFilter = newFilter.filter(obj => { return obj.gender === newSValue.gender })
		if ((newSValue.type === 'people' && newSValue.homeworld !== 'any')) newFilter = newFilter.filter(obj => { return obj.homeworld === newSValue.homeworld })
		if ((newSValue.type === 'people' && newSValue.species !== 'any')) newFilter = newFilter.filter(obj => { return obj.species === newSValue.species })
		if ((newSValue.type === 'people' && newSValue.hairColor !== 'any')) newFilter = newFilter.filter(obj => { return obj.hairColor === newSValue.hairColor })
		if ((newSValue.type === 'people' && newSValue.eyeColor !== 'any')) newFilter = newFilter.filter(obj => { return obj.eyeColor === newSValue.eyeColor })

		setFiltered(newFilter)

		if (newSValue.type === 'people') {
			let tl = gsap.timeline()
			let child = document.querySelectorAll('.panim')
			tl.to(child[0], { duration:1, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut})
			tl.to(child[1], { duration:1, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut}, "<0.1")
			tl.to(child[2], { duration:1, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut}, "<0.1")
			tl.to(child[3], { duration:1, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut}, "<0.1")
			tl.to(child[4], { duration:1, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut}, "<0.1")

		}
		if (newSValue.type === 'any' || newSValue.type === 'planets') {
			let tl = gsap.timeline()
			let child = document.querySelectorAll('.panim')
			tl.to(child[4], { duration: 1, opacity: 0, y: -20, scale: 0 , ease: Power3.easeInOut})
			tl.to(child[3], { duration: 1, opacity: 0, y: -20, scale: 0 , ease: Power3.easeInOut}, "<0.1")
			tl.to(child[2], { duration: 1, opacity: 0, y: -20, scale: 0 , ease: Power3.easeInOut}, "<0.1")
			tl.to(child[1], { duration: 1, opacity: 0, y: -20, scale: 0 , ease: Power3.easeInOut}, "<0.1")
			tl.to(child[0], { duration: 1, opacity: 0, y: -20, scale: 0 , ease: Power3.easeInOut}, "<0.1")
		}
	}

	return (
		<>
			<div id="dpfcontainer">
				<div id="dpfoptions1">
					<div tabIndex={2} className="dpfselect" onClick={() => setDdownValue('type')}>
						{(SValue.type === 'any')
							? <> <p className='pstandby'>Type</p>
								<img className='imgstandby' src={Icons.Arrow} alt="arrow" />	</>
							: <> <p className='pshow'>{SValue.type}</p>
								<img className='imgshow' src={Icons.X} alt="x" onClick={() => Dropselection('type', 'any')} /></>
						}
					</div>
					<div tabIndex={2} className="dpfselect" onClick={() => setDdownValue('films')}>
						{(SValue.films === 'any')
							? <> <p className='pstandby'>Films</p>
								<img className='imgstandby' src={Icons.Arrow} alt="arrow" />	</>
							: <> <p className='pshow'>{SValue.films}</p>
								<img className='imgshow' src={Icons.X} alt="x" onClick={() => Dropselection('films', 'any')} /> </>
						}
					</div>
					<div tabIndex={2} className="dpfselect panim" onClick={() => setDdownValue('gender')}>
						{(SValue.gender === 'any')
							? <> <p className='pstandby'>Gender</p>
								<img className='imgstandby' src={Icons.Arrow} alt="arrow" />	</>
							: <> <p className='pshow'>{SValue.gender}</p>
								<img className='imgshow' src={Icons.X} alt="x" onClick={() => Dropselection('gender', 'any')} /> </>
						}
					</div>
					<div tabIndex={2} className="dpfselect panim" onClick={() => setDdownValue('homeworld')}>
						{(SValue.homeworld === 'any')
							? <> <p className='pstandby'>Home World</p>
								<img className='imgstandby' src={Icons.Arrow} alt="arrow" />	</>
							: <> <p className='pshow'>{SValue.homeworld}</p>
								<img className='imgshow' src={Icons.X} alt="x" onClick={() => Dropselection('homeworld', 'any')} /> </>
						}
					</div>
					<div tabIndex={2} className="dpfselect panim" onClick={() => setDdownValue('species')}>
						{(SValue.species === 'any')
							? <> <p className='pstandby'>Species</p>
								<img className='imgstandby' src={Icons.Arrow} alt="arrow" />	</>
							: <> <p className='pshow'>{SValue.species}</p>
								<img className='imgshow' src={Icons.X} alt="x" onClick={() => Dropselection('species', 'any')} /> </>
						}
					</div>
					<div tabIndex={2} className="dpfselect panim" onClick={() => setDdownValue('hairColor')}>
						{(SValue.hairColor === 'any')
							? <> <p className='pstandby'>Hair Color</p>
								<img className='imgstandby' src={Icons.Arrow} alt="arrow" />	</>
							: <> <p className='pshow'>{SValue.hairColor}</p>
								<img className='imgshow' src={Icons.X} alt="x" onClick={() => Dropselection('hairColor', 'any')} /> </>
						}
					</div>
					<div tabIndex={2} className="dpfselect panim" onClick={() => setDdownValue('eyeColor')}>
						{(SValue.eyeColor === 'any')
							? <> <p className='pstandby'>Eye Color</p>
								<img className='imgstandby' src={Icons.Arrow} alt="arrow" />	</>
							: <> <p className='pshow'>{SValue.eyeColor}</p>
								<img className='imgshow' src={Icons.X} alt="x" onClick={() => Dropselection('eyeColor', 'any')} /> </>
						}
					</div>
					<div className={`dpfddlist`}>
						{filteropt[ddownvalue].map((item, key) => {
							return (
								<p key={key} onClick={() => Dropselection(ddownvalue, item)}>{item}</p>
							)
						})}
					</div>
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
			</div>
			<div id="microdiv" onClick={() => setImgClass(imgClass === '' ? 'active' : '')}>
				<NMicrophone state={imgClass} />
			</div>
		</>
	)
}
export default ProductFilter