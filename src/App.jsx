import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const AdviceCard = styled.article`
	position:absolute;
	width: clamp(14rem, 80vw, 33.6rem);
	top:calc(50% - (2rem / 2));
	left:50%;
	transform:translate(-50%,-50%);
	padding: 3rem 2rem;
	background: var(--DarkGrayishBlue);
	border-radius: 10px;
	box-shadow: -8px 8px 20px 4px rgb(0 0 0 / 10%);
	`
const AdviceNumber = styled.p`
	color: var(--NeonGreen);
	font-size: clamp(13px,3vw,15px);
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 3px;
	`
const AdviceQuote = styled.h1`
	color: var(--LightCyan);
	font-size: clamp(18px, 5vw, 28px);
	transition: top 0.5s ease-in-out;
	line-height: 37px;
	margin: 24px 0 22px 0;
	@media screen and (max-width: 500px){
		line-height: 25px;
	}
	`
const AdviceButton = styled.button`
	border-radius: 50%;
	background: var(--NeonGreen);
	border: none;
	width: 4rem;
	height: 4rem;
	cursor: pointer;
	position:absolute;
	left:50%;
	top: calc(100% - (4rem / 2));
	transform: translate(-50%, 0);
	transition: box-shadow 0.2s ease-in-out;
	&:hover {
		box-shadow: 0px 0px 20px 5px var(--NeonGreen);
	}
	&:active {
		transform: translate(-50%, 0) scale(.9);
	}
	@media screen and (max-width: 500px){
		transform: translate(-50%,0) scale(.85)
	}
	img{
		margin-top: 2px;
	}
	`
const Loader = styled.img`
	position:absolute;
	width: 6rem;
	top:50%;
	left:50%;
	transform:translate(-50%,-50%);
	`

function App() {
	const [advice, setAdvice] = useState(``);
	const [id, setId] = useState(``);
	const [quoteError, setQuoteError] = useState(false);
	const quoteButton = useRef(null);
	let busy = false;

	const getAdvice = (id) => {
		busy = true;
		if (quoteButton.current) quoteButton.current.classList.add("spinner");

		let url = id === "" ? `https://api.adviceslip.com/advice` : `https://api.adviceslip.com/advice/${id}`;

		fetch(url).then(res => res.json()).then(data => {
			setAdvice(data.slip.advice);
			setId(data.slip.id);
			location.hash = data.slip.id;
			setQuoteError(false);
		}).catch(err => {setQuoteError(true)}).finally(() => {
			if (quoteButton.current) quoteButton.current.classList.remove("spinner");
			busy = false;
		})
	}

	useEffect(() => {
		window.addEventListener('hashchange', (e) => id !== new URL(e.newURL).hash && getAdvice(new URL(e.newURL).hash.slice(1)));

		if (location.hash === "") {
			setAdvice(`It is easy to sit up and take notice, what's difficult is getting up and taking action.`);
			return setId(`117`);
		};

		// If the hash is not a number
		if (isNaN(parseInt(location.hash.slice(1)))) {
			return setQuoteError(true);
		};

		// If the hash is greater than 224 or less than 1
		if (parseInt(location.hash.slice(1)) < 1 || parseInt(location.hash.slice(1)) > 224) {
			return setQuoteError(true);
		}
		getAdvice(location.hash.slice(1));
	}, []);

	return (
		<>
			{id === "" && !quoteError ? <Loader src='loader.svg' alt='Loading...' /> : <AdviceCard>
				{
					quoteError ? <>
						<AdviceNumber>Advice #404</AdviceNumber>
						<AdviceQuote>“Happiness not found”</AdviceQuote>
					</> : <>
						<AdviceNumber>Advice #{id}</AdviceNumber>
						<AdviceQuote>“{advice}”</AdviceQuote>
					</>
				}
				<picture>
					<source media="(min-width: 768px)" srcSet="pattern-divider-desktop.svg" />
					<source media="(max-width: 767px)" srcSet="pattern-divider-mobile.svg" />
					<img src="pattern-divider-desktop.svg" alt="" style={{ "maxWidth": "100%", "margin": "24px 0px 17px 0" }} />
				</picture>
				<AdviceButton ref={quoteButton} onClick={() => !busy && getAdvice("")} title='Generate a new advice'>
					<img src="icon-dice.svg" alt=''/>
				</AdviceButton>
			</AdviceCard>
			}
		</>
	)
}

export default App
