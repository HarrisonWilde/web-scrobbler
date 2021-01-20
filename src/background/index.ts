import { browser } from 'webextension-polyfill-ts';
import Logger from 'js-logger';

import { Extension } from '@/background/extension';
import { migrate } from '@/background/util/migrate';

import { getCoreRepository } from '@/background/repository/GetCoreRepository';
import { getNotificationsRepository } from '@/background/repository/GetNotificationsRepository';
import { createScrobblerManager } from '@/background/scrobbler/ScrobblerManagerFactory';
import { AuthenticateHelper } from '@/background/authenticator/AuthenticateHelper';
import { getAccountsRepository } from '@/background/repository/GetAccountsRepository';
import { createAuthenticator } from '@/background/authenticator/ScrobblerAuthenticatorFactory';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { createScrobbler } from '@/background/scrobbler/ScrobblerFactory';
import { createSyncStorage } from '@/background/storage3/namespace/NamespaceStorageFactory';

main();

async function main() {
	Logger.useDefaults({ defaultLevel: Logger.DEBUG });

	const notificationsRepository = getNotificationsRepository();

	await migrate();
	updateCoreVersion();

	new Extension(notificationsRepository).start();

	const scrobbleManager = await createScrobblerManager();
	const accountsRepository = getAccountsRepository();

	const helper = new AuthenticateHelper(
		scrobbleManager,
		accountsRepository,
		createScrobbler,
		createAuthenticator
	);
	await helper.signIn(ScrobblerId.Maloja);
}

function updateCoreVersion() {
	const { version } = browser.runtime.getManifest();

	const coreRepository = getCoreRepository();
	coreRepository.setExtensionVersion(version);
}
