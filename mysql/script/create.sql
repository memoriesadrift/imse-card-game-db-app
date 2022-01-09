CREATE TABLE User (
  Username VARCHAR(18),
  PasswordHash BINARY(64), -- Assume SHA_512, can be changed later
  -- Maximum len. of email (https://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690); is not set as UNIQUE as this is too large of a field
  Email VARCHAR(254),
  Birthday DATE,

  PRIMARY KEY (Username)
);

CREATE TABLE Admin (
  Username VARCHAR(18),
  RealName VARCHAR(100), -- Assume most names under 100 char
  ProfileDescription VARCHAR(280), -- Same as a "Tweet"
  PromotedBy VARCHAR(18),

  PRIMARY KEY (Username),
  FOREIGN KEY (Username) REFERENCES User(Username) ON DELETE CASCADE,
  FOREIGN KEY (PromotedBy) REFERENCES Admin(Username) ON DELETE SET NULL
);

CREATE TABLE CardType(
  ID INTEGER AUTO_INCREMENT,
  Name VARCHAR(32), -- assumption
  WikipediaLink VARCHAR(300), -- assumption
    
  PRIMARY KEY (ID)
);

/*
DELIMETER //
CREATE TRIGGER check_wikipediaLink BEFORE INSERT OR UPDATE ON CardType FOR EACH ROW
BEGIN
IF (SELECT SUBSTRING(NEW.WikipediaLink, 0, 30)) !=  "https://en.wikipedia.org/wiki/" THEN
  SIGNAL SQLSTATE '-200000' SET MESSAGE_TEXT = 'The submitted link seems not to be a valid wikipedia link. All links have to start with https://en.wikipedia.org/wiki/';
END IF;
END //
DELIMETER ;
*/


CREATE TABLE CardGame (
  ID INTEGER AUTO_INCREMENT,
  Name VARCHAR(32), -- assumption
  Description TEXT, -- assumption
  CardTypeID INTEGER,

  PRIMARY KEY (ID),
  FOREIGN KEY (CardTypeID) REFERENCES CardType(ID) ON DELETE CASCADE
);


CREATE TABLE VerifiedCardGame (
  ID INTEGER,
  Comment VARCHAR(280),
  CreationTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  VerifiedBy VARCHAR(18), -- tweet length

  PRIMARY KEY (ID),
  FOREIGN KEY (ID) REFERENCES CardGame(ID) ON DELETE CASCADE,
  FOREIGN KEY (VerifiedBy) REFERENCES Admin(Username) ON DELETE SET NULL
);

CREATE TABLE Review (
  ID INTEGER AUTO_INCREMENT,
  CardGameID INTEGER,
  LeftBy VARCHAR(18),
  ReviewText VARCHAR(280), -- tweet length
  Rating TINYINT,
  CreationTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (ID, CardGameID),
  FOREIGN KEY (CardGameID) REFERENCES CardGame(ID) ON DELETE CASCADE,
  FOREIGN KEY (LeftBy) REFERENCES User(Username) ON DELETE SET NULL
);

CREATE TABLE favorites (
  UserID VARCHAR(18),
  CardGameID INTEGER,

  PRIMARY KEY (UserID, CardGameID),
  FOREIGN KEY (UserID) REFERENCES User(Username) ON DELETE CASCADE,
  FOREIGN KEY (CardGameID) REFERENCES CardGame(ID) ON DELETE CASCADE
);


