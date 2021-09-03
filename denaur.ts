import * as Colors from "https://deno.land/std/fmt/colors.ts";

const args = Deno.args;
const action = args[0];
const pkg = args[1];


function e(output : string) {
	return new TextEncoder().encode(output);
};

function log(output : string) {
	Deno.writeAll(Deno.stdout, e(output));
};

function logn(output : string) {
	Deno.writeAll(Deno.stdout, e(`\n${output}`));
};

async function clean(aurPackage : string) {
	logn("Cleaning up... ");
	const cleanProcess = Deno.run({ cmd: ["rm", "-rf", aurPackage], stdout: "piped" });
	await cleanProcess.status();
	log(Colors.green("done.\n"));
};

async function installPackage(aurPackage : string, verbose : boolean) {
	let stdioOut : any = "piped";
	if(verbose) stdioOut = null;
	
	logn("Cloning repo... ");

	const gitProcess = Deno.run({ cmd: ["git", "clone", `https://aur.archlinux.org/${aurPackage}.git`], stderr: stdioOut, stdout: stdioOut, stdin: stdioOut });
	await gitProcess.status();

	log(Colors.green("done."));

	logn("Building package... \n");

	const buildProcess = Deno.run({ cwd: `./${aurPackage}`, cmd: ["makepkg", "-si", "--noconfirm"], stderr: stdioOut, stdout: stdioOut, stdin: stdioOut });

	const { code } = await buildProcess.status();

	if(code !== 0) {
		logn(Colors.red("An error has occured, cleaning up and displaying error."));
		await clean(aurPackage);
  		const rawError = await buildProcess.stderrOutput();
  		const errorString = new TextDecoder().decode(rawError);
  		return console.log(Colors.red(`\nError:\n${errorString}`));
	};

	console.log(Colors.green(`Package '${aurPackage}' installed successfully.`));
	
	await clean(aurPackage);
	logn(Colors.green("Finished.\n"));
};

async function installPacmanPackage(pacmanPackage : string) {
	logn("Starting install... ");

	const pacmanProcess = Deno.run({ cmd: ["sudo", "pacman", "-Syu", pacmanPackage] });

	const { code } = await pacmanProcess.status();

	if(code !== 0) return console.log(Colors.red("Failed.\n"));;

	console.log(Colors.green(`Package '${pacmanPackage}' installed successfully.`));
	
	logn(Colors.green("Finished.\n"));
};

async function removePackage(aurPackage : string, verbose : boolean) {
	let stdioOut : any = "piped";
	if(verbose) stdioOut = null;
	
	logn("Removing package... \n");

	const removeProcess = Deno.run({ cmd: ["sudo", "pacman", "-R", aurPackage, "--noconfirm"], stderr: stdioOut, stdout: stdioOut, stdin: stdioOut });

	const { code } = await removeProcess.status();

	if(code !== 0) {
		logn(Colors.red("An error has occured."));
  		const rawError = await removeProcess.stderrOutput();
  		const errorString = new TextDecoder().decode(rawError);
  		return console.error(`\nError:\n${errorString}`);
	};

	console.log(Colors.green(`Package '${aurPackage}' removed successfully.`));
	logn(Colors.green("Finished. \n"));
};

function help() {
	console.log("Denaur Commands");
	console.log("	h / help			--displays list of commands and general usage.");
	console.log("	i / install <package>		--installs a package from the AUR.");
	console.log("	pi / pacinstall <package>		--installs a package using pacman.");	
	console.log("	r / remove <package>		--remove a package.");
	console.log("\nDenaur Options");
	console.log("	--verbose");
};

switch(action) {
	case "i":
	case "install":
		installPackage(pkg, args.includes("--verbose"));
		break;

	case "pi":
	case "pacinstall":
		installPacmanPackage(pkg);
		break;

	case "r":
	case "remove":
		removePackage(pkg, args.includes("--verbose"));
		break;

	case "h":
	case "help":
	default:
		help();
		break;	
};