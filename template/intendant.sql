-- phpMyAdmin SQL Dump
-- https://www.phpmyadmin.net/
--
-- Server version: 5.7.24
-- PHP Version: 7.2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `authorization`
--

CREATE TABLE `authorization` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `method` varchar(255) NOT NULL,
  `secure` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `authorization`
--

INSERT INTO `authorization` (`id`, `reference`, `method`, `secure`) VALUES
(1, '/configurations/module', 'GET', 1),
(2, '/widgets', 'GET', 1),
(3, '/process', 'GET', 1),
(4, '/routines', 'GET', 1),
(5, '/profiles', 'GET', 1),
(6, '/users', 'GET', 1),
(7, '/configurations/smartobject', 'GET', 1),
(8, '/smartobjects', 'GET', 1),
(9, '/profiles/:idProfile/authorizations', 'GET', 1),
(10, '/profiles/:idProfile/authorizations', 'POST', 1),
(11, '/smartobjects/:idSmartobject', 'GET', 1),
(12, '/modules/:idModule/actions/:idAction', 'POST', 1),
(13, '/configurations/widget', 'GET', 1),
(14, '/widgets/:idWidget', 'GET', 1),
(15, '/smartobjects', 'POST', 1),
(17, '/smartobjects/:idSmartobject/settings/:idSetting', 'DELETE', 1),
(18, '/smartobjects/:idSmartobject/settings', 'POST', 1),
(20, '/smartobjects/:idSmartobject', 'DELETE', 1),
(21, '/widgets', 'POST', 1),
(23, '/widgets/:idWidget', 'PUT', 1),
(27, '/widgets/:idWidget', 'DELETE', 1),
(28, '/users/:idUser', 'PUT', 1),
(30, '/users/:idUser', 'DELETE', 1),
(31, '/users', 'POST', 1),
(33, '/markets/uninstall', 'POST', 1),
(34, '/markets/install', 'POST', 1),
(35, '/routines', 'PUT', 1),
(36, '/routines/:idRoutine/status', 'PUT', 1),
(37, '/routines/:idRoutine/duplicate', 'PUT', 1),
(38, '/routines/:idRoutine', 'DELETE', 1),
(39, '/routines/:idRoutine', 'GET', 1),
(40, '/routines/:idRoutine', 'POST', 1),
(41, '/smartobjects/:id/actions/:idAction', 'POST', 1),
(43, '/espaces', 'GET', 1),
(44, '/process', 'POST', 1),
(45, '/espace/:id/process/:idProcess', 'GET', 1),
(46, '/process/:idprocess/execute', 'POST', 1),
(47, '/process/:idProcess/inputs', 'POST', 1),
(48, '/process/:idProcess/actions', 'POST', 1),
(50, '/process/:idProcess/profiles', 'POST', 1),
(51, '/process/:idProcess/profiles/:idProfile', 'DELETE', 1),
(52, '/process/:idProcess/actions/:idAction', 'DELETE', 1),
(53, '/process/:idProcess/inputs/:idInput', 'DELETE', 1),
(54, '/process/:idProcess', 'DELETE', 1),
(55, '/widgets/:idWidget/content', 'POST', 1),
(56, '/widgets/:idWidget/sources', 'POST', 1),
(57, '/widgets/:idWidget/sources/:idSource', 'DELETE', 1),
(58, '/widgets/:idWidget/content/:idContent', 'DELETE', 1),
(59, '/users/:idUser/password', 'POST', 1),
(60, '/smartobjects/:idSmartobject/profiles/:idProfile', 'DELETE', 1),
(61, '/smartobjects/:idSmartobject/profiles', 'POST', 1),
(62, '/authentification', 'POST', 0),
(63, '/ping', 'GET', 0);

-- --------------------------------------------------------

--
-- Table structure for table `authorization_profile`
--

CREATE TABLE `authorization_profile` (
  `id` int(11) NOT NULL,
  `authorization` int(11) NOT NULL,
  `profile` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `authorization_profile`
--

INSERT INTO `authorization_profile` (`id`, `authorization`, `profile`) VALUES
(5, 1, 1),
(6, 2, 1),
(7, 3, 1),
(8, 4, 1),
(1, 5, 1),
(9, 6, 1),
(10, 7, 1),
(11, 8, 1),
(2, 9, 1),
(12, 10, 1),
(17, 11, 1),
(16, 12, 1),
(18, 13, 1),
(19, 14, 1),
(20, 15, 1),
(22, 17, 1),
(23, 18, 1),
(25, 20, 1),
(26, 21, 1),
(27, 23, 1),
(32, 27, 1),
(33, 28, 1),
(35, 30, 1),
(36, 31, 1),
(38, 33, 1),
(39, 34, 1),
(40, 35, 1),
(41, 36, 1),
(42, 37, 1),
(44, 38, 1),
(43, 39, 1),
(45, 40, 1),
(46, 41, 1),
(48, 43, 1),
(49, 44, 1),
(50, 45, 1),
(51, 46, 1),
(52, 47, 1),
(53, 48, 1),
(54, 50, 1),
(55, 51, 1),
(56, 52, 1),
(57, 53, 1),
(58, 54, 1),
(59, 55, 1),
(60, 56, 1),
(61, 57, 1),
(62, 58, 1),
(63, 59, 1),
(64, 60, 1),
(65, 61, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `value` longtext NOT NULL,
  `expiry` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `imei` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(1024) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `lastupdate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `espace`
--

CREATE TABLE `espace` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `espace`
--

INSERT INTO `espace` (`id`, `reference`, `name`, `description`, `icon`) VALUES
(1, 'Light', 'Éclairage', 'Modifier les lumières d\'une pièce', 'bulb-outline'),
(2, 'Weather', 'Météo', 'Récupérer les informations intérieur et extérieur ', 'umbrella-outline'),
(3, 'Security', 'Sécurité', 'Activer la sécurité d\'une application', 'shield-outline'),
(4, 'Environment', 'Environnement', 'Gestion de l\'environnement', 'droplet-outline'),
(5, 'Cooking', 'Cuisine', 'Gestion de la cuisine', 'book-outline');

-- --------------------------------------------------------

--
-- Table structure for table `localisation`
--

CREATE TABLE `localisation` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `icon` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `localisation`
--

INSERT INTO `localisation` (`id`, `name`, `icon`) VALUES
(1, 'chambre', 'Home'),
(2, 'salon', 'Home'),
(3, 'cuisine', 'Home'),
(4, 'bureau', 'Home');

-- --------------------------------------------------------

--
-- Table structure for table `process`
--

CREATE TABLE `process` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `name_enable` varchar(255) NOT NULL,
  `name_disable` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `espace` int(11) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `enable` tinyint(4) NOT NULL,
  `mode` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `process_action`
--

CREATE TABLE `process_action` (
  `id` int(11) NOT NULL,
  `process` int(11) NOT NULL,
  `object` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `enable` int(11) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `process_action_argument`
--

CREATE TABLE `process_action_argument` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `process_action` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `process_input`
--

CREATE TABLE `process_input` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `enable` int(11) NOT NULL,
  `process` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `process_profile`
--

CREATE TABLE `process_profile` (
  `id` int(11) NOT NULL,
  `process` int(11) NOT NULL,
  `profile` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `profile`
--

INSERT INTO `profile` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'guest'),
(3, 'occupant');

-- --------------------------------------------------------

--
-- Table structure for table `routine`
--

CREATE TABLE `routine` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `watch` int(11) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `routine_effect`
--

CREATE TABLE `routine_effect` (
  `id` int(11) NOT NULL,
  `routine` int(11) NOT NULL,
  `source` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `routine_effect_argument`
--

CREATE TABLE `routine_effect_argument` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `routine_effect` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `routine_trigger`
--

CREATE TABLE `routine_trigger` (
  `id` int(11) NOT NULL,
  `routine` int(11) NOT NULL,
  `source` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `result` varchar(255) DEFAULT NULL,
  `statement` varchar(255) DEFAULT NULL,
  `expected` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `routine_trigger_argument`
--

CREATE TABLE `routine_trigger_argument` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `routine_trigger` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `smartobject`
--

CREATE TABLE `smartobject` (
  `id` int(11) NOT NULL,
  `module` varchar(255) NOT NULL,
  `reference` varchar(64) NOT NULL,
  `status` int(11) NOT NULL,
  `last_use` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `smartobject_argument`
--

CREATE TABLE `smartobject_argument` (
  `id` int(11) NOT NULL,
  `smartobject` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `smartobject_profile`
--

CREATE TABLE `smartobject_profile` (
  `id` int(11) NOT NULL,
  `smartobject` int(11) NOT NULL,
  `profile` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `smartobject_status`
--

CREATE TABLE `smartobject_status` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `smartobject_status`
--

INSERT INTO `smartobject_status` (`id`, `name`, `icon`) VALUES
(1, 'En ligne', 'flash'),
(2, 'Hors ligne', 'flash-off'),
(3, 'Smartobject inconnu', 'alert-triangle');

-- --------------------------------------------------------

--
-- Table structure for table `storage`
--

CREATE TABLE `storage` (
  `id` varchar(255) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `profile` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `widget`
--

CREATE TABLE `widget` (
  `id` int(11) NOT NULL,
  `reference` varchar(2048) NOT NULL,
  `icon` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `widget_content`
--

CREATE TABLE `widget_content` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `content` varchar(2048) NOT NULL,
  `widget` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `widget_content_type`
--

CREATE TABLE `widget_content_type` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `rank` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Dumping data for table `widget_content_type`
--

INSERT INTO `widget_content_type` (`id`, `reference`, `name`, `rank`) VALUES
(1, 'title', 'Title', 1),
(2, 'content', 'Content', 2),
(3, 'list', 'List', 3);


-- --------------------------------------------------------

--
-- Table structure for table `widget_source`
--

CREATE TABLE `widget_source` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `widget` int(11) NOT NULL,
  `object` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `widget_source_argument`
--

CREATE TABLE `widget_source_argument` (
  `id` int(11) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `widget_source` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authorization`
--
ALTER TABLE `authorization`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `authorization_profile`
--
ALTER TABLE `authorization_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `authorization` (`authorization`,`profile`),
  ADD UNIQUE KEY `authorization_2` (`authorization`,`profile`),
  ADD KEY `profile` (`profile`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `espace`
--
ALTER TABLE `espace`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `localisation`
--
ALTER TABLE `localisation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `process`
--
ALTER TABLE `process`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`),
  ADD KEY `espace` (`espace`);

--
-- Indexes for table `process_action`
--
ALTER TABLE `process_action`
  ADD PRIMARY KEY (`id`),
  ADD KEY `process` (`process`);

--
-- Indexes for table `process_action_argument`
--
ALTER TABLE `process_action_argument`
  ADD PRIMARY KEY (`id`),
  ADD KEY `process_action` (`process_action`);

--
-- Indexes for table `process_input`
--
ALTER TABLE `process_input`
  ADD PRIMARY KEY (`id`),
  ADD KEY `process` (`process`);

--
-- Indexes for table `process_profile`
--
ALTER TABLE `process_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profile` (`profile`),
  ADD KEY `process` (`process`);

--
-- Indexes for table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `routine`
--
ALTER TABLE `routine`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `routine_effect`
--
ALTER TABLE `routine_effect`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `routine_effect_argument`
--
ALTER TABLE `routine_effect_argument`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `routine_trigger`
--
ALTER TABLE `routine_trigger`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `routine_trigger_argument`
--
ALTER TABLE `routine_trigger_argument`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `smartobject`
--
ALTER TABLE `smartobject`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `smartobject_argument`
--
ALTER TABLE `smartobject_argument`
  ADD PRIMARY KEY (`id`),
  ADD KEY `smartobject` (`smartobject`);

--
-- Indexes for table `smartobject_profile`
--
ALTER TABLE `smartobject_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `smartobject` (`smartobject`),
  ADD KEY `profile` (`profile`);

--
-- Indexes for table `smartobject_status`
--
ALTER TABLE `smartobject_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `storage`
--
ALTER TABLE `storage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profile` (`profile`);

--
-- Indexes for table `widget`
--
ALTER TABLE `widget`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `widget_content`
--
ALTER TABLE `widget_content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `widget` (`widget`),
  ADD KEY `type` (`type`);

--
-- Indexes for table `widget_content_type`
--
ALTER TABLE `widget_content_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `widget_source`
--
ALTER TABLE `widget_source`
  ADD PRIMARY KEY (`id`),
  ADD KEY `widget` (`widget`);

--
-- Indexes for table `widget_source_argument`
--
ALTER TABLE `widget_source_argument`
  ADD PRIMARY KEY (`id`),
  ADD KEY `widget_source` (`widget_source`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `authorization`
--
ALTER TABLE `authorization`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `authorization_profile`
--
ALTER TABLE `authorization_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `cache`
--
ALTER TABLE `cache`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `espace`
--
ALTER TABLE `espace`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `localisation`
--
ALTER TABLE `localisation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `process`
--
ALTER TABLE `process`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `process_action`
--
ALTER TABLE `process_action`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `process_action_argument`
--
ALTER TABLE `process_action_argument`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `process_input`
--
ALTER TABLE `process_input`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `process_profile`
--
ALTER TABLE `process_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `routine`
--
ALTER TABLE `routine`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `routine_effect`
--
ALTER TABLE `routine_effect`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `routine_effect_argument`
--
ALTER TABLE `routine_effect_argument`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `routine_trigger`
--
ALTER TABLE `routine_trigger`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `routine_trigger_argument`
--
ALTER TABLE `routine_trigger_argument`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `smartobject`
--
ALTER TABLE `smartobject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `smartobject_argument`
--
ALTER TABLE `smartobject_argument`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `smartobject_profile`
--
ALTER TABLE `smartobject_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `smartobject_status`
--
ALTER TABLE `smartobject_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `widget`
--
ALTER TABLE `widget`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `widget_content`
--
ALTER TABLE `widget_content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `widget_content_type`
--
ALTER TABLE `widget_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `widget_source`
--
ALTER TABLE `widget_source`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `widget_source_argument`
--
ALTER TABLE `widget_source_argument`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `authorization_profile`
--
ALTER TABLE `authorization_profile`
  ADD CONSTRAINT `authorization_profile_ibfk_1` FOREIGN KEY (`authorization`) REFERENCES `authorization` (`id`),
  ADD CONSTRAINT `authorization_profile_ibfk_2` FOREIGN KEY (`profile`) REFERENCES `profile` (`id`);

--
-- Constraints for table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`);

--
-- Constraints for table `process`
--
ALTER TABLE `process`
  ADD CONSTRAINT `process_ibfk_2` FOREIGN KEY (`espace`) REFERENCES `espace` (`id`);

--
-- Constraints for table `process_action`
--
ALTER TABLE `process_action`
  ADD CONSTRAINT `process_action_ibfk_1` FOREIGN KEY (`process`) REFERENCES `process` (`id`);

--
-- Constraints for table `process_action_argument`
--
ALTER TABLE `process_action_argument`
  ADD CONSTRAINT `process_action_argument_ibfk_1` FOREIGN KEY (`process_action`) REFERENCES `process_action` (`id`);

--
-- Constraints for table `process_input`
--
ALTER TABLE `process_input`
  ADD CONSTRAINT `process_input_ibfk_1` FOREIGN KEY (`process`) REFERENCES `process` (`id`);

--
-- Constraints for table `process_profile`
--
ALTER TABLE `process_profile`
  ADD CONSTRAINT `process_profile_ibfk_1` FOREIGN KEY (`profile`) REFERENCES `profile` (`id`),
  ADD CONSTRAINT `process_profile_ibfk_2` FOREIGN KEY (`process`) REFERENCES `process` (`id`);

--
-- Constraints for table `smartobject`
--
ALTER TABLE `smartobject`
  ADD CONSTRAINT `smartobject_ibfk_4` FOREIGN KEY (`status`) REFERENCES `smartobject_status` (`id`);

--
-- Constraints for table `smartobject_profile`
--
ALTER TABLE `smartobject_profile`
  ADD CONSTRAINT `smartobject_profile_ibfk_1` FOREIGN KEY (`smartobject`) REFERENCES `smartobject` (`id`),
  ADD CONSTRAINT `smartobject_profile_ibfk_2` FOREIGN KEY (`profile`) REFERENCES `profile` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`profile`) REFERENCES `profile` (`id`);

--
-- Constraints for table `widget_content`
--
ALTER TABLE `widget_content`
  ADD CONSTRAINT `widget_content_ibfk_1` FOREIGN KEY (`widget`) REFERENCES `widget` (`id`),
  ADD CONSTRAINT `widget_content_ibfk_2` FOREIGN KEY (`type`) REFERENCES `widget_content_type` (`id`);

--
-- Constraints for table `widget_source`
--
ALTER TABLE `widget_source`
  ADD CONSTRAINT `widget_source_ibfk_1` FOREIGN KEY (`widget`) REFERENCES `widget` (`id`);

--
-- Constraints for table `widget_source_argument`
--
ALTER TABLE `widget_source_argument`
  ADD CONSTRAINT `widget_source_argument_ibfk_1` FOREIGN KEY (`widget_source`) REFERENCES `widget_source` (`id`);
COMMIT;
