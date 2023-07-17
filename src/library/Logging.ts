import chalk from 'chalk';

export default class Logging {
	public static log = (args: any) => this.info(args);
	/** Blue */
	public static setup = (args: any) =>
		console.log(
			chalk.green(`[${new Date().toLocaleString()}] [SETUP]`),
			typeof args === 'string' ? chalk.greenBright(args) : args,
		);
	public static info = (args: any) =>
		console.log(
			chalk.blue(`[${new Date().toLocaleString()}] [INFO]`),
			typeof args === 'string' ? chalk.blueBright(args) : args,
		);
	/** Yellow */
	public static warning = (args: any) =>
		console.log(
			chalk.yellow(`[${new Date().toLocaleString()}] [WARN]`),
			typeof args === 'string' ? chalk.yellowBright(args) : args,
		);
	/** Red */
	public static error = (args: any) =>
		console.log(
			chalk.red(`[${new Date().toLocaleString()}] [ERROR]`),
			typeof args === 'string' ? chalk.redBright(args) : args,
		);
}
