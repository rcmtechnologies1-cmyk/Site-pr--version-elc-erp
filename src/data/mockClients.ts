import { Client } from '@/types';

/**
 * ============================================
 * MOCK DATA : BASE DE DONNÉES CLIENTS
 * ============================================
 * Clients réalistes du secteur BTP au Togo
 * Mix de clients publics (ministères) et privés (particuliers, entreprises)
 */

export const MOCK_CLIENTS: Client[] = [
  // ============================================
  // CLIENTS PUBLICS (Ministères, Collectivités)
  // ============================================
  {
    id: '1',
    name: 'Ministère des Travaux Publics',
    phone: '+228 22 21 45 12',
    email: 'contact@mtp.gouv.tg',
    address: 'Avenue de la Présidence, Lomé',
    type: 'PUBLIC',
    createdAt: '2025-01-10'
  },
  {
    id: '2',
    name: 'Mairie de Lomé',
    phone: '+228 22 21 33 55',
    email: 'mairie@lome.tg',
    address: 'Place de l\'Indépendance, Lomé',
    type: 'PUBLIC',
    createdAt: '2025-02-05'
  },
  {
    id: '3',
    name: 'Direction Générale des Routes',
    phone: '+228 22 21 67 89',
    email: 'dgr@togo.tg',
    address: 'Boulevard du 13 Janvier, Lomé',
    type: 'PUBLIC',
    createdAt: '2024-11-20'
  },
  {
    id: '4',
    name: 'Préfecture de Kpalimé',
    phone: '+228 24 41 10 22',
    email: 'prefecture.kpalime@togo.tg',
    address: 'Centre-ville, Kpalimé',
    type: 'PUBLIC',
    createdAt: '2025-01-15'
  },

  // ============================================
  // CLIENTS PRIVÉS (Particuliers, Entreprises)
  // ============================================
  {
    id: '5',
    name: 'M. Koffi Mensah',
    phone: '+228 90 12 34 56',
    email: 'k.mensah@gmail.com',
    address: 'Quartier Adidogomé, Lomé',
    type: 'PRIVE',
    createdAt: '2025-02-20'
  },
  {
    id: '6',
    name: 'Mme Akossiwa Dogbé',
    phone: '+228 91 23 45 67',
    email: 'akossiwa.dogbe@yahoo.fr',
    address: 'Quartier Hédzranawoé, Lomé',
    type: 'PRIVE',
    createdAt: '2025-01-28'
  },
  {
    id: '7',
    name: 'ECOBANK Togo',
    phone: '+228 22 21 88 99',
    email: 'projets@ecobank.tg',
    address: 'Avenue de la Nouvelle Marché, Lomé',
    type: 'PRIVE',
    createdAt: '2024-12-10'
  },
  {
    id: '8',
    name: 'Hôtel Sarakawa',
    phone: '+228 22 21 45 55',
    email: 'direction@sarakawa.tg',
    address: 'Boulevard de la Marina, Lomé',
    type: 'PRIVE',
    createdAt: '2025-01-05'
  },
  {
    id: '9',
    name: 'M. Kokou Adzovi',
    phone: '+228 92 34 56 78',
    email: 'k.adzovi@outlook.com',
    address: 'Quartier Nyékonakpoè, Lomé',
    type: 'PRIVE',
    createdAt: '2025-02-12'
  },
  {
    id: '10',
    name: 'Société TOGOTELECOM',
    phone: '+228 22 20 00 00',
    email: 'infra@togotel.tg',
    address: 'Rue du Commerce, Lomé',
    type: 'PRIVE',
    createdAt: '2024-10-25'
  }
];
