const args = Deno.args;
const action = args[0];
const pkg = args[1];

async function clean(aurPackage) {
	console.log("Cleaning up...");
	const cleanProcess = Deno.run({ cmd: ["rm", "-rf", aurPackage], stderr: "piped", stdout: "piped" });
	await cleanProcess.status();
	console.log("Finished.");
};

async function installPackage(aurPackage, verbose) {
	let stdioOut = "piped";
	if(verbose) stdioOut = null;
	
	console.log("Cloning repo...");
	const gitProcess = Deno.run({ cmd: ["git", "clone", `https://aur.archlinux.org/${aurPackage}.git`], stderr: stdioOut, stdout: stdioOut });
	await gitProcess.status();
	console.log("Repo cloned, starting build process...");
	const buildProcess = Deno.run({ cwd: `./${aurPackage}`, cmd: ["makepkg", "-si"], stderr: stdioOut, stdout: stdioOut });
	console.log("Package now building. Please be patient.");
	await buildProcess.status();

	const { code, success, stderr, stdout } = buildProcess;
	if(stderr) {
		console.error("Error during build process: " + JSON.stringify(stderr));
		return clean(aurPackage);
	}

	console.log(`Package '${aurPackage}' installed successfully.`);
	clean(aurPackage);
};

function help() {
	console.log("Denaur Help");
	console.log("	help			--displays list of commands and general usage.");
	console.log("	install <package>	--installs a package from the AUR.");	
};

switch(action) {
	case "install":
		installPackage(pkg, args.includes("--verbose"));
		break;

	case "help":
	default:
		help();
		break;	
};
